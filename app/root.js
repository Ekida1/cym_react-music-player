import React from 'react'
import Header from './components/header'
import Progress from './components/progress'
import Player from './page/player'
import MusicList from './page/musiclist'
import {MUSIC_LIST} from './config/musiclist'
import {Router , IndexRoute, Link , Route, hashHistory} from 'react-router'
import Pubsub from 'pubsub-js'


let App = React.createClass({
    getInitialState(){
        return{
           musicList: MUSIC_LIST,
           currentMusicItem: MUSIC_LIST[0],
           repeatType: 'cycle',
           ref:"getsonfunction",
        }
    },
    
    componentDidMount() {
       $('#player').jPlayer({
           supplied:'mp3',
           wmode:'window'
       });
       this.playMusic(this.state.musicList[0]);

       $('#player').bind($.jPlayer.event.ended, (e) => {   //注意此处一定要先绑定音乐播放完的事件再执行 playmodel()方法，不然会每次都只执行state里默认的 cycle模式播放 
        this.playModel(this.state.repeatType);
    })

      
       

       
    Pubsub.subscribe('PLAY_MUSIC' , (msg,musicItem) => {  //接收事件进行处理,musicItem参数为子组件下事件发布时上传来的参数
                this.playMusic(musicItem)
                console.log(musicItem)
            });

    Pubsub.subscribe('DELETE_MUSIC' , (msg,musicItem) => {   //接收事件进行处理,musicItem参数为子组件下事件发布时上传来的参数
        this.setState({
            musicList: this.state.musicList.filter(item =>{
                return item !== musicItem;
            })
        });
            });

    Pubsub.subscribe('PLAY_NEXT' , () => {  //接收事件
                if('random' === this.state.repeatType){
                     this.playNext('random');   //随机播放函数
                }
                else{
                     this.playNext('next')
                }
            });
    Pubsub.subscribe('PLAY_PREV' , () => {   //接收事件
                if('random' === this.state.repeatType){
                    this.playNext('random');   //随机播放函数
                }
                else{
                    this.playNext('prev')
                }
            });
    Pubsub.subscribe('CHANAGE_REPEAT', (msg,repeatType) =>{   
             if('cycle' === repeatType){
                //this.playNext('self');  回传参数仅仅只是为了改变图标状态，不需要管歌曲播放啊，管歌曲播放的是 playModel()方法
                this.setState({
                    repeatType: 'self'
                });
                console.log(this.state.repeatType)
             }
             else if ('self' === repeatType){
                //this.playNext('random');  回传参数仅仅只是为了改变图标状态，不需要管歌曲播放啊，管歌曲播放的是 playModel()方法
                this.setState({
                    repeatType: 'random'
                });
                console.log(this.state.repeatType)
             }
             else if ('random' === repeatType){
                //this.playNext('cycle'); 回传参数仅仅只是为了改变图标状态，不需要管歌曲播放啊，管歌曲播放的是 playModel()方法
                this.setState({
                    repeatType: 'cycle'
                });
                console.log(this.state.repeatType)
             }
    })        
    },
    componentWillUnmount() {
          Pubsub.unsubscribe('PLAY_MUSIC');
          Pubsub.unsubscribe('DELETE_MUSIC');
          Pubsub.unsubscribe('PLAY_NEXT');
          Pubsub.unsubscribe('PLAY_PREV');
          Pubsub.unsubscribe('CHANAGE_REPEAT');
          $('#player').unbind($.jPlayer.event.ended)
      },

      playModel(type){
          if(type === 'cycle'){
          
        this.playNext('next');   //顺序循环播放函数
        console.log("现在是顺序循环播放")

     }  else if (type === 'self') {
       
            this.playNext('self');   //单曲循环函数
            console.log("现在是单曲循环播放")
        
     }  else if (type === 'random') {
       
            this.playNext('random');   //随机播放函数
            console.log("现在是随机播放")
        
     }
        },


    playMusic(item){
        $('#player').jPlayer("setMedia", {
            mp3:item.file
        }).jPlayer('play');
        this.setState({
            currentMusicItem:item
        });
        let cid = this.state.currentMusicItem.cid
        console.log(cid + '!!!')
        this.refs.getsonfunction.getInfo(cid)
        
    },
    playNext(type) {
          let index = this.findMusicIndex(this.state.currentMusicItem);
          let newIndex = null;
          let musicListLength = this.state.musicList.length;
          console.log(musicListLength)
          if(type === 'next') {
             newIndex = (index + 1) % musicListLength;
             this.playMusic(this.state.musicList[newIndex]);
          }else if(type === 'prev'){
             newIndex = (index - 1 + musicListLength) % musicListLength;
             this.playMusic(this.state.musicList[newIndex]);
          }
           else if(type === 'self'){
               newIndex = index;
               this.playMusic(this.state.musicList[newIndex]);
          }
           else if(type ==='random'){
            let index = this.findMusicIndex(this.state.currentMusitItem);
			let randomIndex = this.randomRange(0, this.state.musicList.length - 1);
			while(randomIndex === index) {
				randomIndex = this.randomRange(0, this.state.musicList.length - 1);
            }
            this.playMusic(this.state.musicList[randomIndex]);
           }
    },
    findMusicIndex(musicItem) {
        return this.state.musicList.indexOf(musicItem)
    },

    randomRange (under, over) {
            return Math.ceil(Math.random() * (over - under) + under);
    },
     
    render() {
        return (
            <div>
            <Header />
           {this.props.children && React.cloneElement(this.props.children,this.state) } 
           {/* {this.props.children && React.cloneElement(this.props.children,{ref:"getSwordButton"}) } */}

           {/* 上面的表达式表示 this.props 表示{App}，它的children表示{App}下的 {Player}和{MusicList}
                 this.state表示 getInitialStat里的 musicList, currentMusicItem，
                 将this.state传给this.proprs.children就可以做到类似一下的表达式

            <MusicList
               currentMusicItem = {this.state.currentMusicItem}
               
               musicList={this.state.musicList}
               >
            </MusicList> */}
                 </div>
        );
    }
})
let Root = React.createClass({
    render() {
        return(
        <Router history={hashHistory}>
              <Route path="/"  component={App}>
                  <IndexRoute component={Player}></IndexRoute>
                  <Route path="/list" component={MusicList}></Route>
              </Route>
        </Router>
        )
    }
});
export default Root