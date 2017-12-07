import React from 'react'
import './progress.less'

let Progress = React.createClass({
    getDefaultProps() {
		return {
			barColor: '#2f9842'
		}
	},
    changeProgress(e){
      let progressBar = this.refs.progressBar; //获取原生的ref为progressBar 的DOM节点
      let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
      console.log(progress)
      this.props.onProgressChange && this.props.onProgressChange(progress)
      this.props.onPlay()
    },
    render() {
        return (
          <div className="components-progress" ref="progressBar" onClick={this.changeProgress}>
        		<div className="progress" style={{width: `${this.props.progress}%`, background:this.props.barColor}}
                > </div>
        	</div>
        );
    }
});
export default Progress;