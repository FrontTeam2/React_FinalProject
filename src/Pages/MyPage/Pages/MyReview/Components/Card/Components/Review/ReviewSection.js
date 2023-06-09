import * as S from './Components/style'
import { useState } from 'react'
import Stars from './Components/Stars'
import NullReviewMsg from './Components/NullReviewMsg'
import WriteMode from './Components/WriteMode'
import Button from '../../../../../../../../Components/Button/Button'
import { usePostReview } from '../../../../../../../../Hooks/Queries/post-review'
import { useEffect } from 'react'
import { useUpdateReview } from '../../../../../../../../Hooks/Queries/update-review'
import { useDeleteReview } from '../../../../../../../../Hooks/Queries/delete-review'
import ConfirmDelete from './Components/ConfirmDelete'

const ReviewImagesMapForImgURL = ReviewImages => {
	return ReviewImages ? ReviewImages.map(({ img_url }) => img_url) : []
}

const onMakeMainAndSubImageArray = (main, subImages) => {
	const hasMainImage = main !== undefined && main !== 'undefined'

	return [
		...(hasMainImage ? [main] : []),
		...ReviewImagesMapForImgURL(subImages),
	]
}

function ReviewSection({ idx, review }) {
	const isWrittenReview = Object.keys(review).length !== 0

	const {
		idx: review_idx,
		title,
		content,
		ondo,
		img_url,
		ReviewImages,
	} = review

	// 아직 작성하지 않았다면 review === null
	const [mode, setMode] = useState('read') // 'read' | 'write'
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)
	const [errorData, setErrorData] = useState(null)
	const [newReview, setNewReview] = useState({
		title: '',
		content: '',
		ondo: ondo || 0,
		images: [],
	})
	const [imageArray, setImageArray] = useState([]) // 모든 이미지를 함께 가지고 있는 배열
	const originalImageLength = onMakeMainAndSubImageArray(
		img_url,
		ReviewImages,
	).length // 기존 이미지 길이

	// 서버 데이터와 클라이언트 데이터를 맞추는 함수
	const setReviewToNewReview = () => {
		setNewReview({
			title: title || '',
			content: content || '',
			ondo: ondo || 0,
			images: [],
		})
		setImageArray(onMakeMainAndSubImageArray(img_url, ReviewImages))
	}

	useEffect(() => {
		setReviewToNewReview()
	}, [review])

	const postReview = usePostReview() // 리뷰 등록 (post)
	const updateReview = useUpdateReview() // 리뷰 수정 (patch)
	const deleteReview = useDeleteReview() // 리뷰 삭제 (delete)

	const onAppendObjectToFormData = object => {
		const formData = new FormData()
		Object.entries(object).forEach(([key, value]) => {
			if (key === 'images' && Array.isArray(value)) {
				value.forEach(img => {
					formData.append('images', img)
				})
			} else {
				formData.append(key, value)
			}
		})
		return formData
	}

	const onClickChangeMode = async e => {
		switch (e.target.innerText) {
			case '취소':
				setMode('read')
				setReviewToNewReview()
				break

			case '수정':
				setMode('write')
				break

			case '삭제':
				setShowConfirmDelete(true)
				break

			case '확인':
				if (!isWrittenReview) {
					// 등록인 경우
					const formData = onAppendObjectToFormData(newReview)
					try {
						await postReview.mutateAsync({
							payList_idx: idx,
							newReview: formData,
						})
						setMode('read')
					} catch (err) {
						setErrorData(err)
					}
				} else {
					// 수정일 경우
					const { title, content, ondo, images } = newReview
					const hasImages = images.length > 0 // 수정한 이미지가 있는지
					const updateNewReview = {
						// 이미지를 수정하지 않았다면 images를 포함 X
						...(hasImages ? newReview : { title, content, ondo }),
						...(imageArray.length !== 0 && {
							main_url: imageArray[0],
							img_url: imageArray.slice(1),
						}),
					}
					const formData = onAppendObjectToFormData(updateNewReview)
					try {
						await updateReview.mutateAsync({
							review_idx,
							newReview: formData,
						})
						setMode('read')
					} catch (err) {
						setErrorData(err)
					}
				}
				break
		}
	}

	// Confirm 모달이 띄워졌을 때 confirm을 받으면 그때 삭제하기 위해
	const onClickDeleteReview = async () => {
		await deleteReview.mutateAsync({ review_idx })
		setMode('read')
		setShowConfirmDelete(false)
	}

	// 쓰기 모드
	if (mode === 'write')
		return (
			<WriteMode
				mode={{ mode, onClickChangeMode }}
				review={review}
				imageArray={{ imageArray, setImageArray }}
				originalImageLength={originalImageLength}
				newReview={{ newReview, setNewReview }}
				errorData={{ errorData, setErrorData }}
			/>
		)

	// 읽기 모드
	// 리뷰가 없는 경우
	if (!isWrittenReview && mode === 'read')
		return <NullReviewMsg setMode={setMode} />

	// 리뷰가 있는 경우
	return (
		<S.Wrapper>
			{showConfirmDelete && (
				<ConfirmDelete
					onConfirm={onClickDeleteReview}
					onCancel={() => setShowConfirmDelete(false)}
				/>
			)}

			<S.Container>
				<Stars mode={mode} ondo={newReview.ondo} setNewReview={setNewReview} />
				<S.BottomSection>
					<S.ContentSection>
						<S.TextBox type={'title'}>{newReview.title}</S.TextBox>
						<S.TextBox type={'content'}>{newReview.content}</S.TextBox>
					</S.ContentSection>
					<S.ImageSection>
						{Array(4)
							.fill('')
							.map((_, i) => (
								<S.ImageBox key={i} imgURL={imageArray[i]} />
							))}
					</S.ImageSection>
				</S.BottomSection>
				<S.ButtonSection>
					<Button fontSize={'small'} size={'fit'} onClick={onClickChangeMode}>
						수정
					</Button>
					<Button
						variant={'no-border'}
						fontSize={'small'}
						size={'fit'}
						onClick={onClickChangeMode}
					>
						삭제
					</Button>
				</S.ButtonSection>
			</S.Container>
		</S.Wrapper>
	)
}
export default ReviewSection
