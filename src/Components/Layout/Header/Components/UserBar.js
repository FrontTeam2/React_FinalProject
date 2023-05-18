import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FlexAlignCSS } from '../../../../Styles/common'
import { Chatting_Icon } from '../../../Icons/Icons'
// import { Profile_Icon } from '../../../Icons/Icons'

function UserBar({ setSelectedNav }) {
	const navigate = useNavigate() // 네비게이션 추가
	const userMenu = useRef() // 사용자 드롭다운 이외의 영역 클릭시 닫는용 Ref

	return (
		<S.UserWrapper>
			<S.UserContainer>
				<span onClick={() => navigate('/chating')}>
					<Chatting_Icon size="28" color={'black'} />
				</span>
				<S.IssueBox />
				<S.UserBox ref={userMenu}>
					{/* <Profile_Icon size="28" /> */}
					<S.ProfileIMG
						posterIMG={
							'https://img-cf.kurly.com/shop/data/goods/1649403816159l0.jpg'
						}
					/>
					<p>회원명</p>
					<S.UserDropDownMenu className="dropdown">
						<span
							onClick={() => {
								navigate('/mypage-bank')
								setSelectedNav(5)
							}}
						>
							마이페이지
						</span>
						<span
							onClick={() => {
								navigate('/mypage/useredit-userinfo')
								setSelectedNav(5)
							}}
						>
							회원정보 수정
						</span>
						<span
							onClick={() => {
								navigate('/')
								setSelectedNav(4)
							}}
						>
							LOGOUT
						</span>
					</S.UserDropDownMenu>
				</S.UserBox>
			</S.UserContainer>
		</S.UserWrapper>
	)
}

export default UserBar

const UserWrapper = styled.div`
	height: 4rem;
	${FlexAlignCSS}
	justify-content: flex-end;
	color: ${({ theme }) => theme.COLOR.common.white};

	& > * {
		cursor: pointer;
	}

	@media screen and (max-width: ${({ theme }) => theme.MEDIA.mobile}) {
		display: none;
	}
`

const UserContainer = styled.div`
	display: flex;
	column-gap: 8px;
`

const UserBox = styled.div`
	${FlexAlignCSS}
	height: 100%;
	color: ${({ theme }) => theme.COLOR.common.black};
	column-gap: 1rem;
	z-index: 600;
	border-radius: 1rem;
	padding: 2px;
	transition: 0.1s ease;

	&:hover {
		&:hover:before {
			content: '';
			position: absolute;
			border-color: transparent transparent
				${({ theme }) => theme.COLOR.common.gray[300]};
			border-style: solid;
			border-width: 0px 20px 11px;
			width: 0rem;
			height: 1rem;
			top: 41px;
			z-index: 20;
			margin-left: 4rem;
		}

		& > .dropdown {
			display: grid;
		}
	}
`

const IssueBox = styled.span`
	position: absolute;
	transform: translateX(1.7rem);
	background: red;
	border: 1px solid ${({ theme }) => theme.COLOR.common.white};
	border-radius: 2rem;
	padding: 0.4rem;
	color: ${({ theme }) => theme.COLOR.common.white};

	@media screen and (max-width: ${({ theme }) => theme.MEDIA.tablet}) {
		padding: 0.5rem;
		transform: translate(2.2rem, -1rem);
	}
`

const ProfileIMG = styled.div`
	position: relative;
	width: 2.8rem;
	height: 2.8rem;
	background: ${({ posterIMG }) => `url(${posterIMG})`} no-repeat center center;
	background-size: cover;
	border-radius: 2rem;
`

const UserDropDownMenu = styled.div`
	position: absolute;
	display: none;
	border: 1px solid ${({ theme }) => theme.COLOR.common.white};
	border-radius: 5%;
	top: 25%;
	z-index: 9999;
	width: 12rem;

	& > span {
		padding: 1rem;
		border: 1px solid ${({ theme }) => theme.COLOR.common.white};
		cursor: pointer;
		border-radius: 1rem;
		background-color: ${({ theme }) => theme.COLOR.common.gray[300]};

		:hover {
			scale: 1.1;
			font-family: ${({ theme }) => theme.FONT_WEIGHT.bold};
			background-color: ${({ theme }) => theme.COLOR.hover};
			border: 1px solid ${({ theme }) => theme.COLOR.common.white};
			color: ${({ theme }) => theme.COLOR.common.white};
		}
	}
`

const S = {
	UserWrapper,
	UserContainer,
	UserBox,
	IssueBox,
	ProfileIMG,
	UserDropDownMenu,
}