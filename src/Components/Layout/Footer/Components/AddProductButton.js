import { useLocation, useNavigate } from 'react-router'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { isScrollAtom } from '../../../../Atoms/scrollState.atom'
import { FlexCenterCSS } from '../../../../Styles/common'
import { AddProduct_Icon } from '../../../Icons/Icons'
import TokenService from '../../../../Utils/tokenService'

function AddProductButton() {
	const navigate = useNavigate()
	const currentURL = useLocation().pathname
	const [scroll, setScroll] = useRecoilState(isScrollAtom)
	const access_token = TokenService.getAccessToken()

	let touchStart = 0
	let touchEnd = 0

	// 모바일 터치 이벤트리스너
	window.addEventListener('touchstart', event => {
		touchStart = event.changedTouches[0].clientY
	})

	window.addEventListener('touchend', event => {
		touchEnd = event.changedTouches[0].clientY

		if (touchEnd - touchStart > -10) {
			setScroll(false)
		} else if (touchEnd - touchStart < -10) {
			setScroll(true)
		}
	})

	/**
	 * 상품 추가 기능
	 */
	const onAddProduct = () => {
		navigate(`/register`)
	}

	return (
		<>
			{!access_token || currentURL.includes('register') ? (
				''
			) : (
				<S.ButtonBox className={scroll ? 'scroll' : ''}>
					<S.Button type="button" onClick={() => onAddProduct()}>
						<AddProduct_Icon size="50" />
					</S.Button>
				</S.ButtonBox>
			)}
		</>
	)
}
export default AddProductButton

const ButtonBox = styled.div`
	position: fixed;
	right: 5%;
	bottom: 90px;
	z-index: 1;
	width: fit-content;
	height: fit-content;
	transition: 0.5s ease;

	@media screen and (max-width: ${({ theme }) => theme.MEDIA.mobile}) {
		&.scroll {
			bottom: 25px;
		}
	}
`

const Button = styled.div`
	${FlexCenterCSS};
	width: 100%;
	height: 100%;
	color: white;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.COLOR.common.white};
	color: ${({ theme }) => theme.COLOR.main};
	cursor: pointer;
	transition: 0.3s ease;

	&:hover {
		scale: 1.2;
		transform: rotate(-180deg);
	}
`

const S = {
	ButtonBox,
	Button,
}
