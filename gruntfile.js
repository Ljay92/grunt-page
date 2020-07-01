/*
 * @Author: your name
 * @Date: 2020-06-30 09:52:43
 * @LastEditTime: 2020-07-01 18:47:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\grunt\gruntfile.js
 */ 
// 实现这个项目的构建任务

// sass编译插件
const sass = require('sass');
// 批量引入多个任务插件
const loadGruntTasks = require('load-grunt-tasks');

// 默认配置
let config = {}

try {
    // 引入项目配置
    const path = require('path');
    const cwd = process.cwd();
    const loadConfig = require(path.join(cwd, 'page-config.js'))
    // 合并配置
    config = Object.assign({},config, loadConfig)
} catch (error) {}


module.exports = grunt =>{
    grunt.initConfig({
        // 清除编译文件
        clean: {
            temp: 'temp/**',
            dist: 'dist/**'
        },
        // js lint检查
        jshint: {
            options: {},
            //具体任务配置
            files: {
                src: ['src/assets/scripts/*.js']
            }
        },
        // js es6+编译
        babel:{
            options:{
                sourceMap: false,
                presets: ['@babel/preset-env']
            },
            main:{
                files:[{
                    expand:true,
                    cwd: 'src/',
                    src: ['assets/scripts/*.js'],
                    dest: 'temp/',
                    ext: '.js'
                }]
            }
        },
        // sass文件编译
        sass: {
            options: {
                sourceMap: false,
                implementation: sass
            },
            main: {
                files: [{
                    expand:true,
                    cwd: 'src/',
                    src: ['assets/styles/*.scss'],
                    dest: 'temp/',
                    ext: '.css'
                }]
            }
        },
        // html编译
        web_swig: {
            options: {
                swigOptions: {
                    cache: false
                },
                getData: function (tpl) {
                    return config.data;
                }
            },
            main: {
                expand: true,
                cwd: 'src/',
                src: "**/*.html",
                dest: "temp/"
            },
        },
        // 复制其他文件
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/',
                        src: ['**'],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/fonts/*'],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/images/*'],
                        dest: 'dist/'
                    },
                ]
            }
        },
        // 压缩图片
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 1, //定义 PNG 图片优化水平
                },
                files: [{
                    expand: true,
                    cwd: 'src/',//原图存放的文件夹
                    src: ['**/*.{png,jpg,jpeg,gif,svg}'], // 优化 img 目录下所有 png/jpg/jpeg/gif图片
                    dest: 'dist/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            }
        },
        // 压缩html
        htmlmin: {
            main:{
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true
                },
                files: [{
                    expand: true,
                    cwd: 'temp/',
                    src: ['**/*.html'],
                    dest: 'dist/'
                }]
            }
        },
        // 压缩css
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'temp/',
                    src: ['assets/styles/*.css'],
                    dest: 'dist/',
                }]
            }
        },
        // 压缩js
        uglify: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'temp/',
                    src: ['assets/scripts/*.js'],
                    dest: 'dist/',
                }]
            } 
        },
        browserSync: {
            serve: {
                bsFiles: {
                    src : 'temp/**/*'
                },
                options: {
                    server: {
                        baseDir: ['temp', 'src', 'pubilc'],
                        routes: {
                            '/node_modules': 'node_modules'
                        }
                    }
                }
            },
            start: {
                bsFiles: {
                    src : 'dist/**/*'
                },
                options: {
                    server: {
                        baseDir: ['dist', 'src', 'pubilc'],
                        routes: {
                            '/node_modules': 'node_modules'
                        }
                    }
                }
            }
        },
        // 监听文件修改
        watch: {
            css: {
                files:['src/assets/styles/*.scss'],
                tasks: ['sass']
            },
            script: {
                files:['src/assets/script/*.js'],
                tasks: ['babel']
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['web_swig']
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        }
    })

    // 自动加载所有的 grunt 插件的任务
    loadGruntTasks(grunt);
    // 配置script 对应的执行名称
    grunt.registerTask('lint',['jshint']);
    // 基础编译
    grunt.registerTask('compile',['sass','babel','web_swig']);
    // 压缩编译
    grunt.registerTask('allmin',['compile','htmlmin','cssmin','uglify', 'imagemin']);
    // build构建，包括压缩混淆
    grunt.registerTask('build',['clean','copy', 'allmin']);
    // 热更新服务
    grunt.registerTask('serve', ['compile','browserSync:serve', 'watch']);
    grunt.registerTask('start', ['build','browserSync:start', 'watch']);
    // 发布
    grunt.registerTask('deploy', ['build','gh-pages']);
}