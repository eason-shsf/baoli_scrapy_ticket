/*
* 脚本使用注意事项：
* 确保已进入购票剧目的页面，并已登录
* 确保账号购票人信息已经完善
* 确保下面的购票人数量、场次的日期及购买最低价格已填写
* 确保账号中没有未支付的订单，否则新订单无法进行提交
*/
var ticketCount = 2
var showDate = "2021-08-27"
var minPrice = "800"
// 入口点击选座购票
var enterBuySelector = '.btn-show-ticket.van-button'
// 选择时间
var timeListSelector = '.show-ticket-tag.show'
// 时间确认后再点第二个选座购票
var timeButtonSelector = '.van-button--warning.van-button--large'

new Promise(async (resolve, reject) => {
    console.log('等待中，请确保执行前已完成网站登录，且已进入待抢票场次的首页... ...')
    await waitUntilElementExist(enterBuySelector, "选座购票", 400)
    console.log('开始执行，点击购票')
    const button = document.querySelector(enterBuySelector)
    if(button) {
        button.click()
        resolve(true)
    }
    else {
        reject(null)
    }
}).then(async () => {
    console.log('正在等待场次信息可用')
    // 先等待即将开票变为选座购票，确保时间可以点击
    await waitUntilElementExist(timeButtonSelector, "选座购票")
    await waitUntilElementExist(timeListSelector)
    
}).then(() => {
    console.log('正在点击场次信息...')
    let timeList = document.querySelectorAll(timeListSelector)
    for (var i = 0; i < timeList.length; i++) {
        if(timeList[i].innerHTML.indexOf(showDate) > -1) {
            timeList[i].click()
        }
    }
    return true
}).then(async () => {
    console.log('正在等待场次确认按钮（选座购票2）')
    await waitUntilElementExist(timeButtonSelector, "选座购票")
    console.log('正在点击场次确认按钮（选座购票2）')
    document.querySelector(timeButtonSelector).click()
    return true
}).then(async () => {
    //座位勾选
    console.log(`正在等待坐席信息可以点击，筛选价格>=${minPrice}的坐席`)
    const priceListSelector = '.product-price-list .product-price-item'
    await waitUntilElementExist(priceListSelector)
    const seatListSelector = '.seat-item .poly-icon-seat'
    await waitUntilElementExist(seatListSelector)
    await waitTime(400)
    const priceList = document.querySelectorAll(priceListSelector)
    const colorList = []
    for (let i = 0; i < priceList.length; i++) {
        if(parseInt(priceList[i].children[1].innerText) >= minPrice) {
            colorList.push(priceList[i].children[0].style.color)
        }
    }
    const seatList = document.querySelectorAll(seatListSelector)
    const goodSeatList = []
    for (let j = 0; j < seatList.length; j++) {
        if(colorList.indexOf(seatList[j].style.color) > -1) {
            goodSeatList.push(seatList[j])
        }
    }
    
    console.log(`正在进行点击价格>=${minPrice}的坐席...`)
    const goodSeatLen = goodSeatList.length
    const finalTicketCount = Math.min(ticketCount, goodSeatLen)
    let startTicketIndex = 0
    if (goodSeatLen > finalTicketCount + 2) {
        startTicketIndex = Math.floor((goodSeatLen - finalTicketCount) * Math.random())
    }
    for (let i = startTicketIndex; i < (startTicketIndex + finalTicketCount); i++) {
        goodSeatList[i].click()
    }
    return finalTicketCount
}).then(async (finalTicketCount) => {
    console.log('等待座位确认按钮可用')
    const confirmSeatButtonSelector = '.bottom-box .choose-btn.van-button'
    await waitUntilElementExist(confirmSeatButtonSelector)
    console.log('点击座位确认按钮')
    document.querySelector(confirmSeatButtonSelector).click()
    return finalTicketCount
}).then(async (finalTicketCount) => {
    console.log('等待购票人信息可选')
    const audienceSelector = '.pick-area-wrap .pick-btn'
    await waitUntilElementExist(audienceSelector)
    console.log('确认订单-选择购票人')
    const audienceList = document.querySelectorAll(audienceSelector)
    const finalAudienceCount = Math.min(finalTicketCount, audienceList.length)
    for (let i = 0; i < finalAudienceCount; i++) {
        audienceList[i].click()
    }
}).then(async () => {
    console.log('等待提交订单按钮可用')
    const submitSelector = '.bottom-box .btn-submit'
    await waitUntilElementExist(submitSelector)
    console.log('点击提交订单按钮')
    document.querySelector(submitSelector).click()
})

async function waitUntilElementExist(cssSelector, text = null, count = 200) {
    async function findAndWait() {
        let ele = document.querySelector(cssSelector)
        if (ele && (!text || (text && ele.innerText.indexOf(text) > -1))) {
            return true
        } else {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(false)
                }, 150 + Math.floor(Math.random() * 100))
            })
        }
    }
    while (!(await findAndWait()) && count > 0) {
        count -= 1
    }
    if (count > 0) {
        console.log(`已获取元素, text: ${text}, selector: ${cssSelector}`)
    }
}

async function waitTime(time = 200) {
    console.warn(`发起等待延时${time/1000}s`)
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

