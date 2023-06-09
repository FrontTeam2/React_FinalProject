import styled from 'styled-components'
import { ColumnNumberCSS, GridCenterCSS } from '../../../../Styles/common'
import { useLocation, useNavigate } from 'react-router-dom'
import { slide } from '../../../../Hooks/useSlide'

function RecentBanner({ freeProduct, usedProduct }) {
	const location = useLocation()
	const validLocation = location?.pathname.split('/')[1]

	// 최근 등록상품 리스트
	const recentProduct = [...freeProduct, ...usedProduct]
	const recentFilter = [...recentProduct]
	recentFilter.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

	const {
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		onMouseDown,
		onMouseMove,
		onMouseUp,
		slider,
		nextSlide,
		prevSlide,
	} = slide(recentFilter.slice(0, 2))

	const navigate = useNavigate()

	return (
		<S.Wrapper>
			<S.Title alignDetail={validLocation}>
				<h3>최근 상품 보러가기</h3>
				<span>오늘 새롭게 등록된 상품을 보러오세요</span>
			</S.Title>
			<S.SlideContainer>
				<S.SlideList
					ref={slider}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
					onMouseDown={onMouseDown}
					onMouseMove={onMouseMove}
					onMouseUp={onMouseUp}
				>
					{recentFilter.slice(0, 2).map((item, idx) => {
						return (
							<S.SlideBox key={idx}>
								{recentFilter.splice(0, 6).map((item, idx) => {
									return (
										<S.SlideItem
											key={idx}
											recentIMG={`${item.img_url}`}
											onClick={() =>
												navigate(`/detail/${item.idx}`, {
													state: item.liked,
												})
											}
										></S.SlideItem>
									)
								})}
							</S.SlideBox>
						)
					})}
				</S.SlideList>
			</S.SlideContainer>
		</S.Wrapper>
	)
}

export default RecentBanner

const Wrapper = styled.section`
	overflow: hidden;
`

const Title = styled.div`
	text-align: ${({ alignDetail }) =>
		alignDetail === 'detail' ? 'left' : 'center'};

	margin-bottom: ${({ alignDetail }) =>
		alignDetail === 'detail' ? '1rem' : '3rem'};
	margin-bottom: 3rem;

	& > h3 {
		margin-bottom: 1rem;
	}
`

const SlideContainer = styled.div`
	position: relative;
`

const SlideList = styled.div`
	${GridCenterCSS}
	grid-auto-flow: column;
	grid-auto-columns: 100%;
	transition: 0.5s ease-in-out;
`

const SlideBox = styled.ul`
	width: 100%;
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

const SlideItem = styled.li`
	cursor: pointer;
	width: 100%;
	background: ${({ recentIMG }) => `url(${recentIMG})`} no-repeat center center;
	background-size: cover;
	box-shadow: inset 0 0 0.3rem rgba(0, 0, 0, 0.2);

	&::after {
		content: '';
		display: block;
		padding-bottom: 100%;
	}

	@media screen and (max-width: ${({ theme }) => theme.MEDIA.mobile}) {
		width: 100%;
	}
`

const S = {
	Wrapper,
	Title,
	SlideContainer,
	SlideList,
	SlideBox,
	SlideItem,
}
