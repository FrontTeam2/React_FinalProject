import styled from 'styled-components'
import {
	ColumnNumberCSS,
	GridCenterCSS,
	WidthAutoCSS,
} from '../../Styles/common'
import SlideBanner from './Components/Banner/SlideBanner'
import MainBanner from './Components/Banner/MainBanner'
import ItemBox from '../../Components/ItemBox/ItemBox'
import { useNavigate } from 'react-router-dom'
import RecentBanner from './Components/Banner/RecentBanner'
import useGetMainPageData from '../../Hooks/Queries/get-mainPage'

function Main() {
	const { data: mainProduct, error, isLoading } = useGetMainPageData()
	const navigate = useNavigate()

	if (isLoading) return
	if (error) return

	const productList = {
		freeProduct: mainProduct.freeProduct,
		usedProduct: mainProduct.usedProduct,
	}

	return (
		<S.Wrapper>
			<MainBanner />
			<S.Container>
				<RecentBanner {...productList} />
				<S.FreeMarketList>
					<S.Title>
						<h3>Free Market</h3>
						<span>네고와 함께하는 무료나눔</span>
					</S.Title>
					<S.ProductList>
						<>
							{mainProduct.freeProduct.map((item, idx) => {
								return (
									<ItemBox
										key={idx}
										prod_idx={item.idx}
										title={item.title}
										description={item.description}
										price={item.price}
										posterPath={item.img_url}
										createdAt={item.created_at}
										isLiked={item.liked}
										status={item.status}
										productsTags={item.ProductsTags}
										onClick={() =>
											navigate(`/detail/${item.idx}`, { state: item.liked })
										}
									/>
								)
							})}
						</>
					</S.ProductList>
				</S.FreeMarketList>
				<SlideBanner mainProduct={mainProduct} />
				<S.TradeUsedList>
					<S.Title>
						<h3>Trade Used</h3>
						<span>네고와 함께하는 중고거래</span>
					</S.Title>
					<S.ProductList>
						<>
							{mainProduct.usedProduct.map((item, idx) => {
								return (
									<ItemBox
										key={idx}
										prod_idx={item.idx}
										title={item.title}
										description={item.description}
										price={item.price}
										posterPath={item.img_url}
										createdAt={item.created_at}
										isLiked={item.liked}
										status={item.status}
										productsTags={item.ProductsTags}
										onClick={() =>
											navigate(`/detail/${item.idx}`, { state: item.liked })
										}
									/>
								)
							})}
						</>
					</S.ProductList>
				</S.TradeUsedList>
			</S.Container>
		</S.Wrapper>
	)
}

export default Main

const Wrapper = styled.section`
	${WidthAutoCSS}

	@media screen and (max-width:${({ theme }) => theme.MEDIA.mobile}) {
		width: 100%;
	}
`

const Container = styled.section`
	margin: 12rem 0;
`

const FreeMarketList = styled.section`
	margin: 12rem 0;
`

const TradeUsedList = styled.section`
	margin: 12rem 0;
`

const Title = styled.div`
	text-align: center;
	margin-bottom: 4rem;

	& > h3 {
		margin-bottom: 1rem;
	}
`

const ProductList = styled.div`
	width: 100%;
	${GridCenterCSS}
	${ColumnNumberCSS(4)};
	column-gap: 2rem;
	row-gap: 6rem;

	@media screen and (max-width: ${({ theme }) => theme.MEDIA.mobile}) {
		${ColumnNumberCSS(2)}
		column-gap: 1rem;
	}
`

const S = {
	Wrapper,
	Container,
	FreeMarketList,
	TradeUsedList,
	Title,
	ProductList,
}
