/*
 * @Author: your name
 * @Date: 2020-06-30 10:00:09
 * @LastEditTime: 2020-06-30 10:00:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\grunt\page-config.js
 */ 
module.exports = {
    data: {
        menus: [
          {
            name: 'Home',
            icon: 'aperture',
            link: 'index.html'
          },
          {
            name: 'Features',
            link: 'features.html'
          },
          {
            name: 'About',
            link: 'about.html'
          },
          {
            name: 'Contact',
            link: '#',
            children: [
              {
                name: 'Twitter',
                link: 'https://twitter.com/w_zce'
              },
              {
                name: 'About',
                link: 'https://weibo.com/zceme'
              },
              {
                name: 'divider'
              },
              {
                name: 'About',
                link: 'https://github.com/zce'
              }
            ]
          }
        ],
        pkg: require('./package.json'),
        date: new Date()
      }
}