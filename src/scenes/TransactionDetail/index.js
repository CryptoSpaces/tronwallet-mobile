import React, { Component } from 'react'
import { ActivityIndicator, NetInfo, SafeAreaView } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import moment from 'moment'
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import Client, { ONE_TRX } from '../../services/client'
import LoadingScene from '../../components/LoadingScene'
import DetailRow from './detailRow'

const firstLetterCapitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
class TransactionDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>Transaction Detail</Utils.Title>
            </Utils.TitleWrapper>
            <Utils.LoadButtonWrapper>
              <Utils.LoadButton onPress={() => navigation.navigate('Balance')}>
                <Feather name='x' color='white' size={32} />
              </Utils.LoadButton>
            </Utils.LoadButtonWrapper>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  state = {
    loadingData: true,
    loadingSubmit: false,
    transactionData: null,
    signedTransaction: null,
    success: null,
    submitError: null,
    submitted: false,
    isConnected: null
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this._loadData()
    })
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._connectionEventListenner
    )
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ isConnected })
    })
  }

  componentWillUnmount() {
    this._navListener.remove()
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
  }

  _connectionEventListenner = isConnected => {
    this.setState({ isConnected }, () => {
      if (isConnected) {
        this._loadData()
      }
    })
  }

  _loadData = async () => {
    const { navigation } = this.props
    const { isConnected } = this.state

    this.setState({ loadingData: true }, () => {
      if (!isConnected) {
        this.setState({ loadingData: false })
      }
    })

    const signedTransaction = navigation.state.params.tx

    try {
      const transactionData = await Client.getTransactionDetails(
        signedTransaction
      )
      this.setState({ transactionData, signedTransaction })
    } catch (error) {
      this.setState({ submitError: error.message })
    } finally {
      this.setState({ loadingData: false })
    }
  }

  submitTransaction = async () => {
    const { signedTransaction } = this.state
    this.setState({ loadingSubmit: true, submitError: null })
    try {
      let success = false;
      const { code } = await Client.broadcastTransaction(signedTransaction)
      if (code === 'SUCCESS') success = true;

      this.setState({
        loadingSubmit: false,
        success,
        submitted: true,
        submitError: null,
      })
    } catch (error) {
      let errorMessage = error.message
      //TODO
      //Refactor lambda function. Research GOAWAY error
      console.warn("Error Transaction Details", error)
      this.setState({
        loadingSubmit: false,
        submitted: true,
        submitError: errorMessage
      })
    }
  }

  renderContracts = () => {
    const { transactionData } = this.state
    if (!transactionData) return
    const { contracts } = transactionData
    const contractsElements = []
    for (const ctr in contracts[0]) {
      if (ctr === 'amount' || ctr === 'frozenBalance') {
        const isTRX = !contracts[0].token  //weird api response
        contractsElements.push(
          <DetailRow
            key={ctr}
            title={firstLetterCapitalize(ctr)}
            text={contracts[0][ctr] / (isTRX ? ONE_TRX : 1)} />
        )
      } else if (ctr === 'votes') {
        const totalVotes = contracts[0][ctr].reduce((prev, curr) => {
          return prev + curr.voteCount
        }, 0)
        contractsElements.push(
          <DetailRow
            key={ctr}
            title="TotalVotes"
            text={totalVotes} />
        )
      } else {
        contractsElements.push(
          <DetailRow
            key={ctr}
            title={firstLetterCapitalize(ctr)}
            text={contracts[0][ctr]} />
        )
      }
    }
    contractsElements.push(
      <DetailRow
        key={'time'}
        title={"Time"}
        text={moment(transactionData.timestamp).format('MM/DD/YYYY HH:MM:SS')}
      />
    )

    return <Utils.Content>{contractsElements}</Utils.Content>
  }

  renderSubmitButton = () => {
    const { loadingSubmit, success } = this.state
    if (success) {
      return <Utils.Content align='center' justify='center'>
        <Feather
          style={{ marginVertical: 5 }}
          name='check-circle'
          size={FontSize['large']}
          color={Colors.green}
        />
        <Utils.Text success size='small'>
          Transaction submitted to network !
          </Utils.Text>
      </Utils.Content>
    }

    return <Utils.Content align='center' justify='center'>
      {loadingSubmit ? (
        <ActivityIndicator size='small' color={Colors.primaryText} />
      ) : (
          <ButtonGradient
            text='Submit Transaction'
            onPress={this.submitTransaction}
            size='small'
          />
        )}
    </Utils.Content>
  }

  renderRetryConnection = () => (
    <Utils.Content align='center' justify='center'>
      <Utils.Text size='small'>
        It seems that you are disconnected Reconnect to the internet before
        proceduring with the transaction
      </Utils.Text>
      <Utils.VerticalSpacer size='large' />
      <ButtonGradient text='Try again' onPress={this._loadData} size='small' />
    </Utils.Content>
  )

  render() {
    const { submitError, loadingData, isConnected, success } = this.state

    if (loadingData) return <LoadingScene />

    return (
      <Utils.Container>
        {!isConnected && this.renderRetryConnection()}
        {isConnected && this.renderContracts()}
        {isConnected && this.renderSubmitButton()}
        <Utils.Content align='center' justify='center'>
          {submitError && (
            <Utils.Error>Transaction Failed: {submitError}</Utils.Error>
          )}
        </Utils.Content>
      </Utils.Container>
    )
  }
}
export default TransactionDetail
