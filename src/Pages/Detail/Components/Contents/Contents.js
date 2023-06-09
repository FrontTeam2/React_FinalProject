import styled from 'styled-components'
import { ColumnNumberCSS, GridCenterCSS } from '../../../../Styles/common'
import RecentBanner from '../../../Main/Components/Banner/RecentBanner'
import useGetMyPageInterestData from '../../../../Hooks/Queries/get-myPageInterest'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useGetMainPageData from '../../../../Hooks/Queries/get-mainPage'
import Maps from './Components/Maps'

function Contents({ detailProduct }) {
	const [page, setPage] = useState(1)
	const navigate = useNavigate()

	const { data: mainProduct, error, status, isLoading } = useGetMainPageData()

	const {
		data: likeData,
		status: likeStatus,
		error: likeError,
		isLoading: likeIsLoading,
	} = useGetMyPageInterestData(page)

	if (status === 'loading') return
	if (isLoading) return
	if (error) return

	const productList = {
		freeProduct: mainProduct.freeProduct,
		usedProduct: mainProduct.usedProduct,
	}

	if (detailProduct === undefined) return

	return (
		<S.PrdListBox>
			<Maps detailProduct={detailProduct} />
			<S.RecentPrdList>
				<RecentBanner {...productList} />
			</S.RecentPrdList>
			<S.InterestPrdList>
				<S.InterestTitle>
					<h3>관심 상품 보러가기</h3>
					<span>내가 찜했던 상품을 다시 둘러보세요</span>
				</S.InterestTitle>
				<S.InterestBox>
					{!likeIsLoading &&
						likeData.LikeList.slice(0, 5).map((item, idx) => {
							return (
								<S.InterestItems
									key={idx}
									interestIMG={item.Product.img_url}
									onClick={() =>
										navigate(`/detail/${item.Product.idx}`, {
											state: item.liked,
										})
									}
								></S.InterestItems>
							)
						})}
				</S.InterestBox>
			</S.InterestPrdList>
		</S.PrdListBox>
	)
}

export default Contents

const PrdListBox = styled.div`
	width: 100%;
	margin: 6rem 0;
	${GridCenterCSS}
	${ColumnNumberCSS(1)}
`
const RecentPrdList = styled.div`
	width: 100%;
	margin-bottom: 6rem;
`
const InterestPrdList = styled.div`
	width: 100%;
`

const InterestTitle = styled.div`
	margin-bottom: 3rem;

	& > h3 {
		margin-bottom: 1rem;
	}
`

const InterestBox = styled.div`
	${GridCenterCSS}
	${ColumnNumberCSS(6)}
	column-gap: 2rem;
	box-sizing: border-box;

	@media screen and (max-width: ${({ theme }) => theme.MEDIA.tablet}) {
		${ColumnNumberCSS(3)}
		column-gap: 1rem;
		row-gap: 1rem;
	}
`
const InterestItems = styled.div`
	width: 100%;
	cursor: pointer;
	background: ${({ interestIMG }) => `url(${interestIMG})`} no-repeat center
		center;
	background-size: cover;
	box-shadow: inset 0 0 0.3rem rgba(0, 0, 0, 0.2);

	&::after {
		content: '';
		display: block;
		padding-bottom: 100%;
	}
`

const S = {
	PrdListBox,
	RecentPrdList,
	InterestPrdList,
	InterestTitle,
	InterestBox,
	InterestItems,
}
