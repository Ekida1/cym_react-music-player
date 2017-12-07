import React from 'react'
import MusicListItem from '../components/musiclistitem'


let MusicList = React.createClass({
    render() {
       
      let listEle = this.props.musicList.map((item)=>{  //map即挨个将 return出来的 musiclistitem里的元素输出出来
           return ( //此处的return 是 map方法里面的return里面的组件
           <MusicListItem 
           
           key={item.id}
           musicItem={item}
           focus={this.props.currentMusicItem === item}
           >
           
           </MusicListItem>
           );
       });
       return (  //这里的return是 整个的render 的 return
          <ul>
              { listEle }  
          </ul>  //此处会挨个return出listEle里面的元素
          );
    }
})

export default MusicList