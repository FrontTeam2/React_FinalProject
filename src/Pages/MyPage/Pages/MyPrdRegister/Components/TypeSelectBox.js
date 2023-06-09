import styled from 'styled-components'
import { useState } from 'react'
import { FlexBetweenCSS } from '../../../../../Styles/common'
import { Down_Icon } from '../../../../../Components/Icons/Icons'
import { useEffect } from 'react'

function TypeSelectBox({
	setCategory,
	category,
	page,
	setPage,
	setSearchParams,
}) {
	const secondhandText = '중고상품'
	const FreeText = '무료상품'

	const [isOpenSlide, setIsOpenSlide] = useState(false)
	const [type, setType] = useState(secondhandText)

	const onClickType = e => {
		e.preventDefault()
		let selected = e.target.textContent
		setCategory(selected === '무료상품' ? 1 : 0)
		setType(() => selected)
		setPage(1)
	}

	useEffect(() => {
		setCategory(prev => prev)
		setType(category == 0 ? '중고상품' : '무료상품')
		setSearchParams({ category: category, page: page })
	}, [type])

	return (
		<S.Wrapper onClick={() => setIsOpenSlide(prev => !prev)}>
			<S.BoxContainer>
				<span>{type}</span>
				<Down_Icon />
			</S.BoxContainer>
			{isOpenSlide && (
				<S.SelectContainer>
					<S.SelectItem onClick={onClickType} state={type === secondhandText}>
						{secondhandText}
					</S.SelectItem>
					<S.SelectItem onClick={onClickType} state={type === FreeText}>
						{FreeText}
					</S.SelectItem>
				</S.SelectContainer>
			)}
		</S.Wrapper>
	)
}
export default TypeSelectBox

const Wrapper = styled.div`
	position: relative;
	width: 13rem;

	@media screen and (max-width: ${({ theme }) => theme.MEDIA.mobile}) {
		width: 10rem;
	}
`

const BoxContainer = styled.div`
	${FlexBetweenCSS};
	width: 100%;
	height: 3.5rem;
	padding: 0 1.3rem;
	border: 1px solid ${({ theme }) => theme.COLOR.common.gray[400]};
	border-radius: 0.5rem;
	cursor: pointer;

	& > span {
		font-size: ${({ theme }) => theme.FONT_SIZE.tiny};
	}
`

const SelectContainer = styled.ul`
	position: absolute;
	z-index: 10;
	width: 100%;
	border: 1px solid ${({ theme }) => theme.COLOR.common.gray[400]};
	border-radius: 0.5rem;
	background-color: ${({ theme }) => theme.COLOR.common.white};
	margin-top: 0.8rem;
`

const SelectItem = styled.li`
	line-height: 3.5rem;
	padding: 0 1.3rem;
	font-size: ${({ theme }) => theme.FONT_SIZE.tiny};
	color: ${({ theme, state }) => state && theme.COLOR.hover};
	cursor: pointer;

	&:hover {
		transition: all 0.1s ease-in-out;
		background-color: ${({ theme }) => theme.COLOR.common.gray[100]};
	}
`

const S = { Wrapper, BoxContainer, SelectContainer, SelectItem }
