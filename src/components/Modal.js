import React from 'react'
import { Modal } from 'react-native'
import PropTypes from 'prop-types'

const ModalComponent = ({
  modalOpened,
  closeModal,
  animationType,
  children
}) => (
  <Modal
    animationType={animationType}
    transparent={false}
    visible={modalOpened}
    onRequestClose={closeModal}
  >
    {children}
  </Modal>
)

ModalComponent.propTypes = {
  modalOpened: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  animationType: PropTypes.oneOf(['none', 'slide', 'fade']),
  modalData: PropTypes.object
}

export default ModalComponent
