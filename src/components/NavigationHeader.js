import React from 'react'
import { SafeAreaView } from 'react-native'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'

import * as Utils from './Utils'

const NavigationHeader = ({ title, onClose }) => (
    <SafeAreaView style={{ backgroundColor: 'black' }}>
        <Utils.Header>
            <Utils.TitleWrapper>
                <Utils.Title>{title}</Utils.Title>
            </Utils.TitleWrapper>
            {onClose &&
                <Utils.LoadButtonWrapper>
                    <Utils.LoadButton onPress={onClose}>
                        <Feather name='x' color='white' size={32} />
                    </Utils.LoadButton>
                </Utils.LoadButtonWrapper>}
        </Utils.Header>
    </SafeAreaView>
)
NavigationHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func,
};

export default NavigationHeader