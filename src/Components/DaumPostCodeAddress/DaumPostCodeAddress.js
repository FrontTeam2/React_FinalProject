import DaumPostcode from 'react-daum-postcode'
import styled from 'styled-components'

import { useSetRecoilState } from 'recoil'

import { FlexCenterCSS } from '../../Styles/common'
import { isOpenModalAtom } from '../../Atoms/modal.atom'
import axios from 'axios'

function DaumPostCodeAddress({ setResultAddress, setAddressInfo }) {
	const setIsOpenModal = useSetRecoilState(isOpenModalAtom)

	const gpsSelect = async data => {
		try {
			setIsOpenModal(false)
			let ResultAddress = data.sido + ' ' + data.sigungu + ' ' + data.bname
			setResultAddress(ResultAddress)
			document.body.style.overflow = 'auto'
			const searchTxt = data.address

			const config = {
				method: 'get',
				url:
					'https://dapi.kakao.com/v2/local/search/address.json?query=' +
					searchTxt,
				headers: {
					Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_RESTAPI}`,
				},
			}
			await axios(config).then(result => {
				if (result.data !== undefined || result.data !== null) {
					if (result.data.documents[0].x && result.data.documents[0].y) {
						setAddressInfo({
							x: result.data.documents[0].x,
							y: result.data.documents[0].y,
						})
					}
				}
			})
		} catch {}
	}

	return (
		<Wrapper>
			<DaumPostcode onComplete={gpsSelect} autoClose />
		</Wrapper>
	)
}
export default DaumPostCodeAddress

const Wrapper = styled.div`
	${FlexCenterCSS}
	padding-top: 20px;
`
