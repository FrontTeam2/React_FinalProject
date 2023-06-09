import styled from 'styled-components'
import {
	EtcOption_Icon,
	FillHeart_Icon,
	NotFillHeart_Icon,
} from '../Icons/Icons'
import { useState } from 'react'
import { FlexBetweenCSS, GridCenterCSS } from '../../Styles/common'
import { elapsedTime } from './timeSet'
import { useMutation } from '@tanstack/react-query'
import ProductApi from '../../Apis/productApi'

// 컴포넌트 불러올 때, props로
// 데이터(상품 이미지, 상품 제목, 상품 설명, 상품 가격) 보내와서 입히기
function SoldOutItemBox({
	posterPath,
	title,
	context,
	price,
	isLiked,
	createdAt,
	status,
	prod_idx,
	...rest
}) {
	const [isHeart, setIsHeart] = useState(isLiked)
	const statusValue = String(status).includes('판매완료')

	const { mutateAsync } = useMutation(prod_idx => ProductApi.like(prod_idx))

	const onHeart = () => {
		mutateAsync({ prod_idx })
		setIsHeart(prev => !prev)
	}

	const onEdit = () => {}

	return (
		<S.Wrapper>
			{status !== '판매완료' &&
				(!isHeart ? (
					<NotFillHeart_Icon size="30" onClick={onHeart} />
				) : (
					<FillHeart_Icon size="30" onClick={onHeart} />
				))}
			<S.SoldOutContainer />
			<S.IMGContainer
				posterIMG={posterPath}
				statusValue={statusValue}
				{...rest}
			>
				{statusValue && <h1>SOLD OUT</h1>}
			</S.IMGContainer>
			<S.DescContainer>
				<S.DescBox context={context}>
					<h4>{title}</h4>
					{context !== '' ? (
						<p>{context}</p>
					) : (
						<EtcOption_Icon size="30" onClick={onEdit} />
					)}
				</S.DescBox>
				<S.DescBox2>
					<h4>{price.toLocaleString()}원</h4>
					<span>{elapsedTime(createdAt)}</span>
				</S.DescBox2>
			</S.DescContainer>
		</S.Wrapper>
	)
}

export default SoldOutItemBox

const Wrapper = styled.div`
	${FlexBetweenCSS}
	flex-direction: column;
	position: relative;
	width: 100%;
	height: 100%;
	z-index: 0;
	box-sizing: border-box;
	overflow: hidden;

	& > svg {
		position: absolute;
		z-index: 999;
		cursor: pointer;
		top: 1.4rem;
		right: 1.4rem;
		color: ${({ theme }) => theme.COLOR.main};

		// 파람으로 보낼 데이터의 디폴트와 변수를 구분해서 삼항 연산자로 정리
	}
`

const SoldOutContainer = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
`

const IMGContainer = styled.div`
	position: relative;
	cursor: ${({ statusValue }) => !statusValue && 'pointer'};
	width: 100%;
	height: 27.6rem;
	background: ${({ posterIMG }) => `url(${posterIMG})`} no-repeat center center
		${({ statusValue }) => statusValue && ',rgba(0, 0, 0, 0.5)'};
	background-blend-mode: multiply;
	background-size: cover;
	${({ statusValue }) => statusValue && GridCenterCSS}
	color: ${({ theme }) => theme.COLOR.common.white};

	// 드래그 방지
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
`

const DescContainer = styled.div`
	${FlexBetweenCSS}
	width:100%;
	padding: 0 1rem;
	flex-direction: column;
	align-items: baseline;
	margin-top: 2rem;
	/* background: red; */
`

const DescBox = styled.div`
	width: 100%;
	${({ context }) => context === '' && FlexBetweenCSS}

	& > h4 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	& > p {
		margin: 1rem 0 2rem;
		overflow: hidden;
		text-overflow: ellipsis;
		/* white-space: nowrap; 1줄로 넘친 글자를 생략할 때 이용 */
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
`

const DescBox2 = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`

const S = {
	Wrapper,
	SoldOutContainer,
	IMGContainer,
	DescContainer,
	DescBox,
	DescBox2,
}
