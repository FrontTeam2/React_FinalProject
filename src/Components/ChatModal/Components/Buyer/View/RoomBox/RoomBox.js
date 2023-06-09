import { useState } from 'react'
import styled from 'styled-components'

function BuyRoomBox({ list, onSetRoomIdx }) {
	const options = {
		timeZone: 'Asia/Seoul',
		hour12: true, // 오후/오후 구분을 위해 true로 설정합니다.
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}

	const [select, setSelect] = useState(null)
	// 채팅방 중 가장 최근 메시지 시간 필터
	const onClickSelect = id => {
		setSelect(id)
	}

	return (
		<S.RoomBoxContainer>
			{list &&
				list.map(item => {
					const utcDate = new Date(item.lastMessageCreatedAt)
					const korTime = utcDate.toLocaleString('ko-KR', options)

					return (
						<S.ProfileBox
							roomSelectid={select}
							roomid={item.idx}
							key={item.idx}
							onClick={() => {
								onSetRoomIdx(item.idx)
								onClickSelect(item.idx)
							}}
						>
							<S.ProductIMG img={item.product.img_url} />
							<S.profileInfo>
								<S.userNickname>판매자 : {item.User.nick_name}</S.userNickname>
								<p>{korTime}</p>
								<p>{item.isRead ? '읽음' : '안읽음'}</p>
							</S.profileInfo>
						</S.ProfileBox>
					)
				})}
		</S.RoomBoxContainer>
	)
}

export default BuyRoomBox

const RoomBoxContainer = styled.div`
	width: 30%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: ${({ theme }) => theme.COLOR.common.gray[100]};

	box-shadow: 1px 1px 1px gray;
	border-radius: 1rem;
	overflow-y: scroll;

	::-webkit-scrollbar {
		display: none;
	}
`
const ProfileBox = styled.div`
	display: flex;
	width: 100%;
	padding: 1rem 0.1rem;
	margin-bottom: 0.5rem;
	gap: 0.5rem;
	height: 7rem;
	border-radius: 1rem;
	box-shadow: ${({ theme, roomid, roomSelectid }) =>
		roomid === roomSelectid
			? '2px 2px 1px 0px' + theme.COLOR.common.gray[200]
			: ''};
	:hover {
		box-shadow: 2px 2px 1px 0px ${({ theme }) => theme.COLOR.common.gray[200]};
		cursor: pointer;
	}
`
const ProductIMG = styled.div`
	width: 5rem;
	height: auto;
	background: ${({ img }) => (img ? `url(${img})` : '이미지없음')} no-repeat
		center center;
	background-size: cover;
`

const profileInfo = styled.div`
	& > p {
		font-size: ${({ theme }) => theme.FONT_SIZE.tiny};
	}
`

const userNickname = styled.span`
	font-size: ${({ theme }) => theme.FONT_SIZE.tiny};
`

const S = {
	RoomBoxContainer,
	ProfileBox,
	ProductIMG,
	profileInfo,
	userNickname,
}
