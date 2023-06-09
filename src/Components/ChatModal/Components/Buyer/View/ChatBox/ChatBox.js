import styled from 'styled-components'
import Input from '../../../../../Input/Input'
import Button from '../../../../../Button/Button'
import { useState } from 'react'
import ChatApi from '../../../../../../Apis/chatApi'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { myChatRoomList } from '../../../../../../Atoms/myChatRoomList.atom'
import { userInfoAtom } from '../../../../../../Atoms/userInfo.atom'
import { useSocket } from '../../../../../../Context/socket'
import { useRef } from 'react'
import BuyMessagesBox from './MessagesBox/MessagesBox'

function BuyChatBox({ roomIdx }) {
	//소켓
	const socket = useSocket()

	// recoil 불러오기
	const [myChatRoom, setMyChatRoom] = useRecoilState(myChatRoomList)
	const [myInfo, setMyInfo] = useRecoilState(userInfoAtom)

	//채팅방 리스트를 받아오고 room_idx와 동일한 채팅방 내역 불러오기
	const chatInfo = myChatRoom.chats.find(item => item.idx === roomIdx)

	//채팅방 내역
	const [allMessages, setAllMessages] = useState([])

	//인풋창(보낼 채팅 입력)
	const messagesInput = useRef('')
	const [sendMessages, setSendMessages] = useState('')
	const onMessageSet = () => {
		setSendMessages(messagesInput.current.value)
	}

	//수신 메시지
	const [receivedMessages, setReceivedMessages] = useState([])
	// UTC 날짜를 한국 날짜로
	const options = {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}
	const utcDate = new Date()
	const koreanDate = utcDate.toLocaleString('ko-KR', options)

	//채팅방 내역 불러올 시 가장 최근 메시지로 자동 스크롤
	const scrollRef = useRef(null)
	useEffect(() => {
		if (scrollRef.current) {
			const scrollContainer = scrollRef.current
			scrollContainer.scrollTop = scrollContainer.scrollHeight
		}
	})

	const newChatRoomList = async () => {
		// 채팅방 리스트 최신화
		try {
			const res = await ChatApi.chatRoomList()
			setMyChatRoom(res.data)
		} catch (err) {}
	}

	const getChatMsg = async () => {
		//특정 채팅방 내역 불러오기
		try {
			const res = await ChatApi.checkChatLog(roomIdx)
			setAllMessages(res.data)
		} catch (error) {}
	}

	const postMessage = async e => {
		const data = {
			title: chatInfo.product.title,
			createdAt:
				new Date(Date.now()).getHours() +
				':' +
				new Date(Date.now()).getMinutes(),

			prod_idx: chatInfo.product.idx,
			roomIdx: roomIdx,
			nicKname: myInfo.nicKname,

			message: messagesInput.current.value,

			isSeller: chatInfo.isSeller,
		}
		if (messagesInput.current.value !== '' && e.keyCode === 13) {
			onMessageSet()
			socket.emit('sendMessage', data)
			try {
				const res = await ChatApi.sendMsg(roomIdx, messagesInput.current.value)

				if (res.status) {
					messagesInput.current.value = ''
					setSendMessages('')
					newChatRoomList()
				}
			} catch (error) {}

			return
		}
		if (messagesInput.current.value === '' && e.keyCode === 13) {
			alert('메세지를 입력해주세요')
			return
		}
	}

	useEffect(() => {
		// 채팅방에 따른 메시지 내역 불러오기
		getChatMsg()
	}, [roomIdx, sendMessages])

	useEffect(() => {
		// 메세지 수신
		socket.on('receiveMessage', data => {
			setReceivedMessages(list => [...list, data])
		})
	}, [socket])

	return (
		<S.ChatContainer>
			<S.ChatDate>
				<span>{koreanDate}</span>

				{/* 오늘 날짜로 */}
			</S.ChatDate>
			<S.ChatOption></S.ChatOption>
			<S.ChatMsg ref={scrollRef}>
				{allMessages?.map((item, idx) => {
					return <BuyMessagesBox key={idx} allMessages={item} myInfo={myInfo} />
				})}
			</S.ChatMsg>
			<S.ChatSend onKeyDown={postMessage}>
				<S.StyledInput
					placeholder="메시지를 입력해주세요"
					ref={messagesInput}

					// value={sendMessages}
					// onChange={e => {
					// 	setSendMessages(e.target.value)
					// }}
				/>

				<S.StyledButton onClick={postMessage}>전송</S.StyledButton>
			</S.ChatSend>
		</S.ChatContainer>
	)
}

export default BuyChatBox

const ChatContainer = styled.div`
	width: 70%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	box-shadow: 1px 1px 1px gray;
	border-radius: 1rem;

	background-color: ${({ theme }) => theme.COLOR.common.gray[100]};
`
const ChatDate = styled.div`
	margin-top: 2rem;
	text-align: center;
	& > span {
		border-radius: 1rem;
		z-index: 9999;
		padding: 0.5rem;
		background-color: ${({ theme }) => theme.COLOR.common.white};
		font-size: ${({ theme }) => theme.FONT_SIZE.tiny};
	}
`
const ChatOption = styled.div`
	position: absolute;
	display: flex;
	top: 0;

	justify-content: flex-end;
	padding: 0 1rem;
	margin-top: 2rem;
	width: 100%;
	height: auto;
	& > span {
		:hover {
			cursor: pointer;
			color: ${({ theme }) => theme.COLOR.main};
		}
	}
`
const ChatMsg = styled.div`
	margin-top: 1rem;
	height: 90%;
	overflow-y: scroll;
	& > h1 {
		text-align: center;
	}
	::-webkit-scrollbar {
		display: none;
	}
`
const ChatSend = styled.div`
	display: flex;
	height: 10%;
	border-top: 1px solid ${({ theme }) => theme.COLOR.common.gray[300]};
	padding: 0 0.3rem;
`
const StyledButton = styled(Button)`
	background: ${({ theme }) => theme.COLOR.main};
	border-radius: 0rem;
	width: 20%;
`
const StyledInput = styled(Input)`
	width: 80%;
	border: none;
	background: ${({ theme }) => theme.COLOR.common.white};
`
const S = {
	ChatContainer,
	ChatDate,
	ChatMsg,
	ChatSend,
	ChatOption,
	StyledButton,
	StyledInput,
}
