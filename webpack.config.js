var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
     entry: [
    'webpack-dev-server/client?http://localhost:3000',//webpack搭建的服务器的地址
     'webpack/hot/only-dev-server', 
     'react-hot-loader/patch', //加载热更新
      path.join(__dirname, 'app/index.js')
  ],  //唯一入口文件
    output:{
        path: path.join(__dirname, '/dist/'), //打包后的文件存放的地方
        filename:'[name].js',  //打包后输出文件的文件名
        publicPath:'/'
    },  //注：“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
    plugins:[
        new HtmlWebpackPlugin({
            template:'./index.tpl.html',
            inject:'body',
            filename:'./index.html'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify('development')
        }),
       
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node-modules/,
                loader:"babel-loader",
                query:
                {
                    presets: ['react','es2015']
                }
            },
       {
        test: /\.css$/,
        loader:'style!css'
      }, {
        test: /\.less/,
        loader:'style-loader!css-loader!less-loader'
      }
    ]
  }
}