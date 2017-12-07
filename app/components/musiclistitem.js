import React from 'react'
import './musiclistitem.less'
import Pubsub from 'pubsub-js'
import { Link } from 'react-router'

 let MusicListItem = React.createClass({
     playMusic(musicItem){
         Pubsub.publish('PLAY_MUSIC' , musicItem);  //发布事件  第一个参数为事件名作为父组件接收事件的标记,第二个参数为要发布出去供接收函数接收的的参数
     },
     deleteMusic(musicItem, e ){
         e.stopPropagation(); //因为 删除按钮是 播放按钮的一个 子标签按钮，点击删除会因为事件的冒泡触发播放按钮，此处是为了停止这种冒泡的操作。
        Pubsub.publish('DELETE_MUSIC' , musicItem);   //发布事件  第一个参数为事件名，为事件名作为父组件接收事件的标记，第二个参数为要发布出去供接收函数接收的的参数
    },
     render() {
         let musicItem = this.props.musicItem;
           return(
            <Link to="/"  className="-col-auto">	
               <li onClick={this.playMusic.bind(this, musicItem)} className={`components-listitem  row ${this.props.focus ? 'focus' : '' }`}>
                   <p><strong> {musicItem.title}</strong> - {musicItem.artist}</p>
                   <p onClick={this.deleteMusic.bind(this, musicItem)}className="-col-auto delete"> </p>
                   </li>
                   </Link>
           );
     }
 })
 export default MusicListItem