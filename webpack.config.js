const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const babel = require('@babel/core')
const less = require('less')

module.exports = {
	mode: 'development',
	watch: true,            
	entry: './src/app.js',           
	output: {
		path: path.join(__dirname, 'dist')
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{from: '**/*.wxml', to: './', context: './src'},
				{from: '**/*.json', to: './', context: './src'},
				{
					from: '**/*.less', 
					to: '[path][name].wxss', 
					context: './src', 
					transform(content, path) {
						return less.render(content.toString())
							.then(function(output) {
								return output.css
							})
					}
				},
				{
					from: '**/*.js', 
					to: './', 
					context: './src',
					transform(content, path) { 
						const newCode = babel.transformSync(content, {
							babelrc: true,
							'presets': ['@babel/env']
						}).code  
						return Promise.resolve(newCode.toString())
					},
					globOptions: {
						ignore: ['**/*.test.js', '**/*.spec.js']   
					} 
				}
			]
		}),
	]
}