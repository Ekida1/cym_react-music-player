import React from 'react'
import Progress from '../components/progress'
import './player.less'
import { Link } from 'react-router'
import Pubsub from 'pubsub-js'
import Modal from 'antd/lib/modal'
import 'antd/lib/modal/style/css'
import Row from 'antd/lib/row'
import 'antd/lib/row/style/css'
import Col from 'antd/lib/col'
import 'antd/lib/col/style/css'



let album = null
let author = null
let pubdate = null
let publisher = null
let duration = null
let Player = React.createClass({
        getInitialState(){
            return{
                progress: 0,
                volume: 0,
                isPlay:true,
                leftTime: '',
                visible: false,
                album:'',
                author:'',
                pubdate:'',
                publisher:'',
            }
        },
         showModal () {
            this.setState({
              visible: true,
            });
          },
          handleOk (e) {
            console.log(e);
            this.setState({
              visible: false,
            });
          },
          handleCancel (e) {
            console.log(e);
            this.setState({
              visible: false,
            });
          },
        componentDidMount() {
        $('#player').bind($.jPlayer.event.timeupdate, (e)=>{
            duration = e.jPlayer.status.duration; //获取音频文件总时长
            this.setState({
                volume: e.jPlayer.options.volume * 100,
                progress: e.jPlayer.status.currentPercentAbsolute,
                leftTime: this.formatTime(duration * (1 -  e.jPlayer.status.currentPercentAbsolute /100) )
            });
        });
       
    },
    componentWillUnmount(){
        $('#player').unbind($.jPlayer.event.timeupdate);
    },
    changeProgressHandler(progress) {
        // console.log('from root widget', progress);
        $('#player').jPlayer('play', duration * progress);
    },
    changeVolumeHandler(progress){
       $('#player').jPlayer('volume', progress)
       console.log(progress)
    },
    play(){
         if(this.state.isPlay) {  //如果图标是 播放
             $('#player').jPlayer('pause');   //图标则变为暂停
         }
         else{
              $('#player').jPlayer('play');  //否则图标则变为播放
             }
           this.setState({
               isPlay: !this.state.isPlay   //音乐播放暂停变播放，播放变暂停
           });
    },
    playprogress(){
        if(!this.state.isPlay) {
        this.setState({
            isPlay: !this.state.isPlay  
        });
      }
    },
    changeRepeat(repeatType){
          Pubsub.publish('CHANAGE_REPEAT',repeatType);
    },
    
    playPrev() {
           Pubsub.publish('PLAY_PREV');   //发布事件  第一个参数为事件名作为父组件接收事件的标记
           console.log(repeatType)
    },
    playNext() {
        Pubsub.publish('PLAY_NEXT');    //发布事件  第一个参数为事件名作为父组件接收事件的标记
    },
    formatTime(time) {
        time = Math.floor(time);
        let min = Math.floor(time/60);
        let sec = Math.floor(time % 60);

        sec = sec < 10 ? `0${sec}` : sec;
        return `${min}:${sec}`;
    },
    getInfo(cid){
        $(function(){
             console.log(cid)
            $.ajax({
                url:'https://api.douban.com/v2/music/' + cid,
                cache:true,
                type:'get',
                dataType:'jsonp',
                crossDomain:true,
                jsonp:'callback',
             })
             .done(function(data){
                 console.log(data.summary)
                  album = data.attrs.title
                  author = data.attrs.singer
                  pubdate = data.attrs.pubdate
                  publisher = data.attrs.publisher
             })
        })
    },
    render() {
        let repeatType = this.props.repeatType;
        return (
            <div className="player-page">
                <h1 className="caption"><Link to="/list"> 我的私人音乐坊 &gt; </Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
					                <Progress
										progress={this.state.volume}
										onProgressChange={this.changeVolumeHandler}
										barColor='#aaa'
					                >
					                </Progress>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px', marginTop:'10px'}}>
			                <Progress
								progress={this.state.progress}
								onProgressChange={this.changeProgressHandler}
                                onPlay={this.playprogress}
			                >
			                </Progress>
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" onClick={this.playPrev}></i>
	                			<i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play}></i>
	                			<i className="icon next ml20" onClick={this.playNext}></i>
                			</div>
                			<div className="-col-auto">
                				<i className={`icon repeat-${repeatType}`} onClick={this.changeRepeat.bind(this,repeatType)}></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                    <img onClick={this.showModal} className="iconpic" src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                    </div>
                </div>
           <div>
           <Modal
          title="歌曲详情 "
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
        >
        <div>
        <Row>
        <Col span={12} >col-12</Col>
        <Col span={12} >
        <dl>
            <dt>专辑名:</dt>
            <dd>{album}</dd>
            <dt>艺人:</dt>
            <dd>{author}</dd>
            <dt>发行时间:</dt>
            <dd>{pubdate}</dd>
            <dt>唱片公司:</dt>
            <dd>{publisher}</dd>
            <dt>简介</dt>
            <dd>
    田馥甄的『日常』 最难以忘怀的『余波荡漾』
        <br />
　　在每一张田馥甄的专辑里，都会有一首难以忘怀的情歌。
<br />
　　这次收录在田馥甄第四张个人专辑『日常』中的第二波抒情主打『余波荡漾』，是在描写一段感情的结束后，以为失去了所有，但其实所有失去的都会以另一种形式留下，默默不断的影响着我们后来的人生。这首『余波荡漾』是由徐世珍、吴辉福填词，李双飞谱曲，惆怅的钢琴声伴随思绪的回荡，弦乐也随着歌曲进行，犹如一幕幕堆砌的回忆，不断在心中余波荡漾着。
<br />　　
一段逝去的感情，在事过境迁之后回头看看，或许才会发现，彼此曾经拥有那些留下来的印记，是人生中另一种美好的获得！
   
</dd>
</dl>
 </Col>
      </Row>
      </div>
        </Modal>
           </div>
            </div>
        );
    }
});


export default Player;