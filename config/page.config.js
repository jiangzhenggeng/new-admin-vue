var path = require('path')
var basePath = path.resolve(__dirname, '../../jiguo/protected/modules/mb/views')

function getTplPath(module) {
	return path.resolve(__dirname, `../src/pages/${module}/block_tpl/index.ejs.js`)
}

function chunksSortMode(a, b) {
	if (a.names == 'manifest') {
		return -1
	}
	if (b.names == 'manifest') {
		return 1
	}
	if (a.names == 'vendor') {
		if (b.names != 'manifest') {
			return -1
		} else {
			return 1
		}
	}
	if (b.names == 'vendor') {
		if (a.names != 'manifest') {
			return 1
		} else {
			return -1
		}
	}
	return a.names[0] > b.names[0] ? 1 : -1;
}

module.exports = [
	{
		name: 'article',
		main: './src/pages/article/main.js',
		options: {
			filename: path.resolve(__dirname, '../../zdm/protected/modules/admin/views/article/_editor.php'),
			template: getTplPath('article'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: false
			},
			chunksSortMode,
		},
		//不允许集体打包方案
		notpackage: true,
		externals: {
			'vue': 'Vue',
			'vuex': 'Vuex',
			'vue-router': 'VueRouter'
		},
		subModel: {
			'UEditor': './static/UEditor/index.js'
		}
	},
	{
		name: 'article2',
		main: './src/pages/article2/main.js',
		output: {
			libraryTarget: 'umd',
			library: '[name]',
		},
		options: {
			filename: path.resolve(__dirname, '../../zdm/protected/modules/admin2/views/article/_editor.php'),
			templateContent: function (param) {
				let htmlWebpackPlugin = param.htmlWebpackPlugin
				let cssStr = []
				for (var css in htmlWebpackPlugin.files.css) {
					cssStr.push(`<link href="${htmlWebpackPlugin.files.css[css]}" rel="stylesheet">`)
				}
				let UEditor = ''
				let article2 = ''
				let manifest = ''
				let vendor = ''
				for (var chunk in htmlWebpackPlugin.files.chunks) {
					if (htmlWebpackPlugin.files.chunks[chunk].entry.indexOf('UEditor') > -1) {
						UEditor = htmlWebpackPlugin.files.chunks[chunk].entry
					}
					if (htmlWebpackPlugin.files.chunks[chunk].entry.indexOf('article2') > -1) {
						article2 = htmlWebpackPlugin.files.chunks[chunk].entry
					}
					if (htmlWebpackPlugin.files.chunks[chunk].entry.indexOf('manifest') > -1) {
						manifest = htmlWebpackPlugin.files.chunks[chunk].entry
					}
					if (htmlWebpackPlugin.files.chunks[chunk].entry.indexOf('vendor') > -1) {
						vendor = htmlWebpackPlugin.files.chunks[chunk].entry
					}
				}

				return `
					${cssStr.join('')}
					<script>
						require.config({
							paths: {
								'UEditor': '${UEditor.replace(/\.js$/i, '')}',
								'product': '${article2.replace(/\.js$/i, '')}'
							},
							shim: {
								'UEditor': {
									deps: [
										'${manifest}',
										'${vendor}'
									]
								},
								'product': {
									deps: ['UEditor']
								}
							}
						});
					</script>
				`

			},
			inject: false,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: false,
			},
			chunksSortMode,
		},
		//不允许集体打包方案
		notpackage: true,
		subModel: {
			'UEditor': './static/UEditor/index.js'
		}
	},
	{
		name: 'product',
		main: './src/pages/product/main.js',
		output: {
			libraryTarget: 'umd',
			library: '[name]',
		},
		options: {
			filename: path.resolve(__dirname, '../../zdm/protected/modules/admin/views/product/_editor.php'),
			template: getTplPath('product'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: false
			},
			chunksSortMode,
		},
		//不允许集体打包方案
		notpackage: true,
		subModel: {
			'UEditor': './static/UEditor/index.js'
		}
	},
	{
		name: 'uiDevel',
		main: './src/pages/uiDevel/main.js',
		options: {
			filename: path.resolve(__dirname, '../dist/index.html'),
			template: getTplPath('uiDevel'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: false
			}
		},
		//不允许集体打包方案
		notpackage: true,
		externals: {
			'vue': 'Vue',
			'vue-router': 'VueRouter'
		}
	}
]













