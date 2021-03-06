import MyAdapter from './MyAdapter.js';
import Config, { UI } from '../config';
import api from '../api/api.js';
import config, { authData, err_info } from '../config'
import * as Service from '../request/request.js'
import React, { Component } from 'react';
import {
    Stepper,
    Wheel,
    Toast
} from 'teaset';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TextInput,
    Picker,
    ToastAndroid,
    Modal,
    ScrollView,
    Alert,
    Button,
} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import RadioModal from 'react-native-radio-master';
const screenWidth = MyAdapter.screenWidth;
const screenHeight = MyAdapter.screenHeight;
const titleFontSize = MyAdapter.titleFontSize;
const abstractFontSize = MyAdapter.abstractFontSize;
const informationFontSize = MyAdapter.informationFontSize;
const btnFontSize = 16;
const marginHorizontalNum = 16;

export default class VoteAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolClassId: this.props.navigation.state.params.classId,
            name: '', //投票名称
            content: "", //投票说明
            privacy: 0, //（1.公开、2.匿名）
            deadline: "", //"2017-09-10 17:00"
            voteContents: [],
            voteOptions: [],

            ModalVisible: false, //是否可见日历
            hour: "00",
            minute: "00",

            questionInitial: 1,
            queationNum: 1, //question的个数,初始值为1

        }
    }

    /** 发布投票函数 */
    _onpress2AddVote() {
        //设定各个部分不为空
        var option = '第一个初始选项';
        var varOption2 = '第二个初始选项';
        var title = '初始标题';
        var voteMode = 1;
        var picture = null;
        var voteOptions = [{'option' : option},{'option' : varOption2}];
        var voteContents = [{'title':title, 'voteMode':voteMode,'picture': picture,'voteOptions': voteOptions}];
        let postBody = {
            schoolClassId: this.state.schoolClassId,
            name: this.state.name, //投票名称
            content: this.state.content, //投票说明
            privacy: this.state.privacy, //（1.公开、2.匿名）
            deadline: this.state.deadline+' '+this.state.hour+':'+this.state.minute, //"2017-09-10 17:00"
            voteContents: voteContents,
        }
        let body = JSON.stringify(postBody);
        let url = Config.VoteAdd;
        Service.UserAction(url, body, 'POST').then((response) => {
            if (response.status !== 200) {
                return null;
            }
            else {
                return response.json();
            }
        }).then((jsonData) => {
            if (jsonData === null) {
                ToastAndroid.show('请求失败！', ToastAndroid.SHORT);
            }
            else if (jsonData.isSuccess) {
                ToastAndroid.show('添加成功！', ToastAndroid.SHORT);
                this.props.navigation.state.params.callback();
                this.props.navigation.goBack();
            }
            else if (jsonData.isWarning) {
                ToastAndroid.show(jsonData.message, ToastAndroid.SHORT);
            }
            else {
                ToastAndroid.show('发生错误，请稍后重试！', ToastAndroid.SHORT);
            }
        }).catch((error) => {
            ToastAndroid.show(err_info.NO_INTERNET, ToastAndroid.SHORT);
            this.props.navigation.state.params.callback();
            this.props.navigation.goBack();
        });
    }

    /** 投票名称*/
    getTitle() {
        return (
            <View style={styles.title}>
                <TextInput style={styles.bulletinDetail} multiline={true}
                    placeholder={'请在此输入投票名称'}
                    onChangeText={(text) =>
                        this.setState({ name: text })
                    }
                >
                </TextInput>
            </View>
        );
    }

    /** 投票说明 */
    getContent() {
        return (
            <View style={styles.content}>
                <TextInput style={styles.bulletinDetail} multiline={true}
                    placeholder={'请在此输入投票说明'}
                    onChangeText={(text) =>
                        this.setState({ content: text })
                    }
                ></TextInput>
            </View>
        );
    }

    /** 返回选择日期 */
    getCalendar() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.ModalVisible}
                onRequestClose={() => { ToastAndroid.show("请选择一个日期", ToastAndroid.SHORT); }}
            >
                <View style={styles.container}>
                    <Calendar
                        onDayPress={(day) => {
                            this.setState({ deadline: day.dateString });
                            this.setState({ ModalVisible: !this.state.ModalVisible });
                        }}
                        theme={{
                            selectedDayBackgroundColor: '#3b50ce',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: 'red'
                        }}
                    />
                </View>
            </Modal>
        );
    }

    onSelect(index, value) {
        this.setState({
            privacy: value
        })
    }

    /** 投票隐私 */
    getPrivacy() {
        return (
            <View style={styles.buttonContainer}>
                <RadioModal
                    selectedValue={this.state.privacy}
                    onValueChange={(id, item) => this.setState({ privacy: id })}
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        flex: 1,
                        backgroundColor: '#ffffff', padding: 5, marginTop: 10
                    }}
                >
                    <Text value={1}>公开</Text>
                    <Text value={2}>匿名</Text>
                </RadioModal>
            </View>
        );
    }

    /** 投票选项 */
    getVoteContentOption() {
        return (
            <View>
                {/** 先建造两个不可取消的选项，再通过方法不断增加或减少选项 */}
            </View>
        );
    }

    componentWillReceiveProps(nextProps) {
        //alert('更新');
    }


    /** 增加一个投票问题 */
    addQuestion() {
        return (
            <View style={styles.voteContentContainer}>

            </View>
        );
    }

    /** 获得整个投票内容 */
    getAllVoteContent() {
        {/** 这个地方应该有投票添加按钮，每个投票都有唯一的标识符，是其在voteContent中的index */ }

        {/** 生成一个初始问题 */ }
        var num = 0;
        for (num = 1; num <= this.state.queationNum; num++) {
            if (num <= this.state.questionInitial) { //如果小于等于初始值，则不设定删除按钮
                return (
                    <Question
                        titleNum={num}
                        isVisible={true}
                    />
                );
            }
            else {

            }
        }

    }

    /** 投票按钮 */
    getVoteAddButton() {
        return (
            <Button
                title = '投票发布'
                onPress={() => { this._onpress2AddVote()}}
            >

            </Button>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                    {/**投票名称 */}
                    {this.getTitle()}

                    {/**投票说明 */}
                    {this.getContent()}

                    {/**投票日期 */}
                    {this.getCalendar()}
                    <View style={styles.container}>
                        <MyBar
                            title="投票截止时间"
                            onPress={() => { this.setState({ ModalVisible: true }); }}
                            placeholder={this.state.deadline}
                            myThis={this}
                        />
                    </View>

                    {/** 投票隐私 */}
                    {this.getPrivacy()}

                    {/** 整个投票内容 */}
                    {this.getAllVoteContent()}

                    {/** 投票发布按钮 */}
                    {this.getVoteAddButton()}
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    optionContainer: { //与voteContentTitle完全相同
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        height: screenHeight / 16,
        borderColor: UI.TOP_COLOR,
        borderWidth: 1,
    },
    voteContentContainer: { //存放voteContent这一个大项
        flex: 1,
    },
    voteContentTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        height: screenHeight / 16,
        borderColor: UI.TOP_COLOR,
        borderWidth: 1,
    },
    mybarContainer: { //与HomeworkPost中一致
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginTop: 16,
        marginHorizontal: 16
    },

    container: {
        backgroundColor: 'white',
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'stretch',
        // alignSelf: 'stretch',
    },
    text: {
        width: 0.2 * screenWidth,
        fontSize: 16,
        color: 'black',
        textAlign: 'left',
    },
    textInput: {
        flex: 1,
        marginLeft: 8,
        height: screenHeight / 16,
        borderColor: 'gray',
        borderWidth: 1
    },
    picker: {
        flex: 1,
        height: screenHeight / 18,
        color: '#000000',
    },
    richText: {
        height: screenHeight / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    tichTextContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        paddingTop: 40
    },
    content: {
        height: screenHeight / 8,
        borderColor: UI.TOP_COLOR,
        borderWidth: 1,
    },
    title: {
        //flex : 1,
        height: screenHeight / 16,
        borderColor: UI.TOP_COLOR,
        borderWidth: 1,
    },
    commitBtn: {
        flex: 1,
    },
    promptText: {
        fontSize: 16,
        color: 'gray',
    },
    bulletinDetail: {
        flex: 1,
        borderColor: 'gray',
        textAlignVertical: 'center',
        borderRadius: 10,
    },
    button: {
        flexDirection: 'row',
        width: screenWidth / 4,
    },
    buttonContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        height: screenHeight / 16,
        borderColor: UI.TOP_COLOR,
        borderWidth: 1,
    },
});

class MyBar extends Component {
    hours;
    minutes;
    constructor(props) {
        super(props);
        this.hours = [];
        this.minutes = [];
        for (var i = 0; i < 24; i++)
            this.hours.push((i < 10 ? '0' : '') + i);
        for (var i = 0; i < 60; i++)

            this.minutes.push((i < 10 ? '0' : '') + i);

    }
    render() {
        return (
            <View style={styles.mybarContainer}
            >
                <Text
                    style={styles.text}
                >
                    {this.props.title}
                </Text>
                <TextInput
                    onFocus={this.props.onPress}
                    placeholder={this.props.placeholder}
                    style={styles.textInput}
                    underlineColorAndroid="transparent"//设置下划线背景色透明 达到去掉下划线的效果
                />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    marginLeft: 8
                }}>
                    <Wheel
                        style={{ height: 48, width: 30 }}
                        itemStyle={{ textAlign: 'center' }}
                        items={this.hours}
                        onChange={(index) => {
                            this.props.myThis.setState({ hour: (index.length == 1 ? ("0" + index) : ("" + index)) });
                        }}
                    />
                    <Text>:</Text>
                    <Wheel
                        style={{ height: 48, width: 30 }}
                        itemStyle={{ textAlign: 'center' }}
                        items={this.minutes}
                        onChange={(index) => {
                            this.props.myThis.setState({ minute: (index.length == 1 ? "0" + index : "" + index) });
                        }}
                    />
                </View>
            </View>
        );
    }
}

class Option extends Component {
    constructor(props) {
        super(props);
        //alert('哈哈哈哈');
        this.state = {
            isVisible: true, //选项是否可见
            deleteButton: this.props.deleteButton, //删除按钮是否可见
            rank: this.props.rank, //不可修改
            //titleNum: this.props.titleNum, //显示的标题num，可修改
            that: this.props.myThis,
            optionInitial: this.props.optionInitial,
            OptionInput: '',
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        //alert(this.props.titleNum + '这是Option的render');
        if (this.state.deleteButton)
            return (
                <View style={styles.optionContainer}>
                    <Text style={styles.text}>
                        选项{this.props.titleNum}
                    </Text>

                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid="transparent"//设置下划线背景色透明 达到去掉下划线的效果
                        onChangeText={(text) =>
                            this.setState({ OptionInput: text })
                        }
                    />
                    <Button
                        onPress={() => { this.props.myThis._onPress2DeleteOption(this.props.titleNum) }}
                        title='删除选项'
                    />
                </View>
            );
        else return (
            <View style={styles.optionContainer}>
                <Text style={styles.text}>
                    选项{this.props.titleNum}
                </Text>

                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid="transparent"//设置下划线背景色透明 达到去掉下划线的效果
                // onChangeText={(text) =>
                //     this.setState({ OptionInput: text })
                // }
                />
            </View>
        );
    }
}

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: true, //问题是否可见
            deleteButton: false, //删除按钮是否可见
            rank: this.props.rank, //不可修改
            titleNum: this.props.titleNum, //显示的问题标题num，可修改
            optionInitial: 2, //初始值定为2，
            optionNum: 2, //当前投票option的数量，每制造一个option则加一
            optionRank: 2, //每个option的标识符
            voteContents: [],
            voteTitle: '',
            voteMode: 0,
        }
    }

    _isMounted;

    /** 点击就加一个option */
    _onpress2AddOption() {
        varOptionNum = this.state.optionNum;
        //alert('first' + this.state.optionNum);
        this.setState({ optionNum: varOptionNum + 1 });
    }

    /** 点击就删除一个option */
    _onPress2DeleteOption(index) {
        var array = this.state.voteContents;
        var arrayLength = array.length;
        for (num = 0; num < arrayLength; num++) {
            if (array[num].props.titleNum == index) {
                array.splice(num, 1);
                varOptionNum = this.state.optionNum;
                this.setState({ optionNum: varOptionNum - 1 });
                this.setState({ voteContents: array });
                break;
            }
        }
    }

    /** 在这里将预先定好的两个option设置，并装入到voteContents */
    componentWillMount() {
        //alert('先执行');
        var array = this.state.voteContents;
        var num = 0;
        for (num = 1; num <= this.state.optionInitial; num++) {
            array.push(
                <Option
                    deleteButton={false}
                    titleNum={num}
                    optionInitial={this.state.optionInitial}
                    myThis={this}
                    isVisible={true}
                />
            );

        }
        this.setState({ voteContents: array }); //回调函数
    }

    componentWillUpdate(nextProps, nextState) {
        //alert('更新在Question中执行方法');
        var array = this.state.voteContents;
        var varOptionRank = this.state.optionRank;
        if (nextState.optionNum > array.length) { //证明要添加新的
            varOptionRank++;
            array.push(
                <Option
                    deleteButton={true} //需要有删除按钮
                    titleNum={varOptionRank}
                    optionInitial={this.state.optionInitial}
                    myThis={this}
                    isVisible={true}
                />
            );
        }
        this.setState({ optionRank: varOptionRank });
        this.setState({ voteContents: array });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.optionNum != this.state.optionNum) return true;
        if (nextState.voteContents != this.state.voteContents) return true;
        return false;
    }


    /** 点击就删除该question，该方法需链接到主类的删除方法 */


    //测试方法，测试添加选项功能
    addOptionTest() { //需要传参
        var array = this.state.voteContents;
        return (
            <View style={styles.voteContentContainer}>
                {array}
            </View>
        );

    }

    /** 投票标题 */
    getVoteContentTitle() {
        return (
            <View style={styles.voteContentTitle}>
                <Text>标题</Text>
                <TextInput
                    placeholder={'请在此输入投票标题'}
                    onChangeText={(text) =>
                        this.setState({ voteTitle: text })
                    }
                    style={styles.textInput}
                    underlineColorAndroid="transparent"//设置下划线背景色透明 达到去掉下划线的效果
                >
                </TextInput>
            </View>
        );
    }

    /** 投票模式 */
    getVoteContentVoteMode() {
        return (
            <View style={styles.buttonContainer}>
                <RadioModal
                    selectedValue={this.state.voteMode}
                    onValueChange={(id, item) => this.setState({ voteMode: item })}
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        flex: 1,
                        backgroundColor: '#ffffff', padding: 5, marginTop: 10
                    }}
                >
                    <Text value="1">单选</Text>
                    <Text value="2">多选</Text>
                </RadioModal>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={styles.text}>
                    问题{this.state.titleNum}
                </Text>

                <Button
                    onPress={() => { this._onpress2AddOption() }}
                    title='添加选项'
                />

                {/** 标题部分 */}
                {this.getVoteContentTitle()}

                {/** 投票模式 */}
                {this.getVoteContentVoteMode()}

                {/** 投票选项 */}
                {this.addOptionTest()}


            </View>
        );
    }

}