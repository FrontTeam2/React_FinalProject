import styled from 'styled-components'
import { FlexCenterCSS } from '../../../Styles/common'
import { Controller, useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import Button from '../../../Components/Button/Button'
import { useRecoilState } from 'recoil'
import { isOpenModalAtom } from '../../../Atoms/modal.atom'
import { FORM_TYPE } from '../../../Consts/form.type'
import ViewMap from './ViewMap'
import ProductApi from '../../../Apis/productApi'
import FormItem from './InputComponents/FormItem'
import CategoryItem from './InputComponents/CategoryItem'
import PriceItem from './InputComponents/PriceItem'
import TagsItem from './InputComponents/TagsItem'
import RegionModal from '../../../Components/Modal/RegionModal/RegionModal'
import AlertText from '../../../Components/AlertText/AlertText'
import Modal from '../../../Components/Modal/Modal'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import scrollToTop from '../../../Utils/scrollToTop'
import MESSAGE from '../../../Consts/message'
import ErrorModal from '../../../Components/Error/ErrorModal'

function Inputs({ DetailData, setImgNum, imageFileArr, imageList }) {
	const {
		control,
		watch,
		formState: { errors },
		handleSubmit,
		setValue,
		clearErrors,
	} = useForm()

	const navigate = useNavigate()

	const params = useParams()

	const watchedCategory = watch('category')
	const [isOpenModal, setIsOpenModal] = useRecoilState(isOpenModalAtom)
	const [submitType, setSubmitType] = useState('등록')
	const [modalType, setModalType] = useState('')

	const [hashValue, setHashValue] = useState('')
	const [hashArr, setHashArr] = useState([])
	const [intPrice, setIntPrice] = useState(0)

	//동까지만 나오는 state
	const [resultAddress, setResultAddress] = useState('')

	//위도 경도
	const [LatAndLng, setLatAndLng] = useState('')

	//가격 콤마 찍는 함수
	const priceToString = e => {
		if (!isNaN(e)) {
			const price = String(e)
			const changePrice = Number(price.replaceAll(',', '')).toLocaleString()
			setIntPrice(changePrice)
		} else {
			const price = e.target.value
			const changePrice = Number(price.replaceAll(',', '')).toLocaleString()
			setIntPrice(changePrice)
		}
	}

	const checkedCategory = () => {
		const checkedNum = watchedCategory
		if (checkedNum === '1') {
			setIntPrice('0')
		}
	}

	const setRegion = result => {
		setValue('region', result)
		clearErrors('region')
		setResultAddress(result)
	}

	const onkeyDown = e => {
		if (e.nativeEvent.isComposing) return
		if (e.key === 'Enter') {
			e.preventDefault()
			setHashValue('')
			if (e.target.value.trim().length === 0) return
			setHashArr(prev => [...prev, e.target.value])
		}
	}

	const deleteTagItem = e => {
		setHashArr(hashArr.filter(el => el !== e))
	}

	const { mutate, error } =
		submitType === '등록'
			? useMutation(formData => ProductApi.register(formData), {
					onSuccess: () => {
						setIsOpenModal(() => true)
					},
					onError: () => {
						setModalType('registerError')
						setIsOpenModal(() => true)
					},
			  })
			: useMutation(formData => ProductApi.editProduct(formData), {
					onSuccess: () => {
						setIsOpenModal(() => true)
					},
					onError: () => {
						setModalType('editProductError')
						setIsOpenModal(() => true)
					},
			  })

	const onSubmit = async data => {
		let subUrl = []
		if (
			(!imageFileArr.length && submitType == '등록') ||
			imageList.length === 0
		)
			return setImgNum(true), scrollToTop(0)

		let price = 0
		if (data.category !== '1') {
			price = Number(intPrice.replace(/,/g, ''))
		}

		setModalType('isSuccess')

		const formData = new FormData()
		formData.append('title', data.title)
		formData.append('price', Number(price))
		formData.append('description', data.description)
		formData.append('region', resultAddress)
		formData.append('category', Number(data.category))
		formData.append('tag', hashArr)

		if (submitType === '수정') {
			imageList.map((el, idx) => {
				if (idx === 0) {
					formData.append('main_url', el)
					formData.append('images', imageFileArr[idx])
				} else {
					subUrl.push(el)
					formData.append('images', imageFileArr[idx])
				}
			})
			formData.append('idx', params.prod_idx)
			formData.append('img_url', subUrl.join())

			mutate(formData)
		}
		if (submitType === '등록') {
			for (let i = 0; i < imageFileArr.length; i++) {
				formData.append('images', imageFileArr[i])
			}
			mutate(formData)
		}
	}

	useEffect(() => {
		checkedCategory()
	}, [watchedCategory])

	useEffect(() => {
		if (DetailData) {
			const { title, price, region, category, ProductsTags, description } =
				DetailData.searchProduct
			setValue('title', title)
			setValue('description', description)
			setValue('region', region)
			setValue('category', category ? '1' : '0')
			priceToString(price)
			if (!hashArr.length) {
				ProductsTags.map(Tags => setHashArr(hash => [...hash, Tags.Tag.tag]))
			}
			setSubmitType(() => '수정')
		}
	}, [DetailData])

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{isOpenModal && modalType === ('registerError' || 'editProductError') && (
				<ErrorModal error={error} />
			)}

			<Controller
				name="title"
				control={control}
				rules={FORM_TYPE.PRODUCT_TITLE_TYPE}
				render={({ field }) => (
					<FormItem name={'title'} errors={errors} field={field} />
				)}
			></Controller>
			<Controller
				name="hash"
				control={control}
				rules={{
					required: hashArr.length === 0 && '최소 하나 이상 태그 작성해주세요 ',
				}}
				render={({ field }) => (
					<TagsItem
						name={'hash'}
						errors={errors}
						field={field}
						hashArr={hashArr}
						onKeyDown={onkeyDown}
						onChange={e => setHashValue(e.target.value)}
						deleteTagItem={deleteTagItem}
						setHashValue={setHashValue}
						value={hashValue}
					/>
				)}
			></Controller>
			<S.CategortContainer>
				<Controller
					name="category"
					control={control}
					rules={FORM_TYPE.PRODUCT_CATEGORY_TYPE}
					render={({ field }) => (
						<>
							<S.CategoryContainer>
								<CategoryItem
									errors={errors}
									name={'무료'}
									field={field}
									checked={watchedCategory === '1'}
									value={'1'}
								/>
								<CategoryItem
									errors={errors}
									name={'중고'}
									field={field}
									checked={watchedCategory === '0'}
									value={'0'}
								/>
							</S.CategoryContainer>

							<S.StyledAlertText type="error">
								{errors.category && errors.category.message}
							</S.StyledAlertText>
						</>
					)}
				></Controller>
			</S.CategortContainer>
			<Controller
				name="price"
				control={control}
				rules={{ required: !intPrice && '중고상품은 가격을 입력해주세요.' }}
				render={({ field }) => (
					<PriceItem
						name={'무료'}
						errors={errors}
						field={field}
						onChange={e => priceToString(e)}
						value={intPrice}
						type={'text'}
						disabled={watchedCategory === '1' ? true : false}
					/>
				)}
			></Controller>
			<Controller
				name="description"
				control={control}
				rules={FORM_TYPE.PRODUCT_DESCRIPTION_TYPE}
				render={({ field }) => (
					<FormItem name={'description'} errors={errors} field={field} />
				)}
			></Controller>
			<Controller
				name="region"
				control={control}
				rules={{ required: '주소를 입력해주세요' }}
				render={({ field }) => (
					<FormItem
						name={'region'}
						errors={errors}
						field={field}
						setIsOpenModal={setIsOpenModal}
						setModalType={setModalType}
					/>
				)}
			></Controller>
			{isOpenModal && modalType === 'region' && (
				<RegionModal setResultAddress={setRegion} setLatAndLng={setLatAndLng} />
			)}
			<ViewMap LatAndLng={LatAndLng} />

			{isOpenModal && modalType === 'isSuccess' && (
				<Modal size={'medium'}>
					<S.ModalText>
						{DetailData
							? MESSAGE.EDITPRODUCT.SUCCESS
							: MESSAGE.REGISTER.SUCCESS}
						<Button
							size={'full'}
							variant={'default-reverse'}
							onClick={() =>
								navigate(
									`/mypage-register?category=${Number(
										watchedCategory,
									)}&page=${1}`,
								)
							}
						>
							이전 페이지로 돌아가기
						</Button>
					</S.ModalText>
				</Modal>
			)}
			<S.ButtonWrap>
				<Button type="submit" style={{ margin: '4rem' }}>
					{DetailData ? '수정 완료' : '등록 완료'}
				</Button>
				<Button style={{ margin: '4rem' }} variant={'default-reverse'}>
					취소
				</Button>
			</S.ButtonWrap>
		</form>
	)
}
export default Inputs

const ButtonWrap = styled.div`
	${FlexCenterCSS}
`

const CategortContainer = styled.div`
	display: flex;
	align-items: center;
	@media screen and (max-width: ${({ theme }) => theme.MEDIA.mobile}) {
		display: flex;
		flex-direction: column;
	}
`
const StyledAlertText = styled(AlertText)`
	margin-top: 0.3rem;
	font-size: 1.5rem;
	text-align: end;
	width: 100%;
`
const CategoryContainer = styled.div`
	width: 100%;
	height: 7rem;
	display: flex;
	align-items: center;
`
const ModalText = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	height: 100%;
	font-size: ${({ theme }) => theme.FONT_SIZE.large};
`
const S = {
	CategoryContainer,
	CategortContainer,
	ButtonWrap,
	StyledAlertText,
	ModalText,
}
