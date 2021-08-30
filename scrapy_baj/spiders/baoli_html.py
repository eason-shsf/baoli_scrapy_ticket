# -*- coding: utf-8 -*-
import scrapy
import logging
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Baj58HtmlNewSpider(scrapy.Spider):
    name = 'baoli_html'
    siteType = 6  # 表示类型保利
    custom_settings = {
      'DOWNLOADER_MIDDLEWARES': {
        'scrapy.downloadermiddlewares.retry.RetryMiddleware': 10
      },
      'ROBOTSTXT_OBEY': False,
      # 'DOWNLOAD_TIMEOUT': 30,
      # 'DOWNLOAD_DELAY': 30
    }
    allowed_domains = ['m.polyt.cn']
    start_urls = ['https://m.polyt.cn/detail/50/30360/592009357139955712']
    try_count = 0

    def __init__(self):
        self.driver = webdriver.Chrome('C:\\ProgramInstall\\chromedriver91_win32\\chromedriver.exe')
        # executor_url = self.driver.command_executor._url
        # session_id = self.driver.session_id
        # driver.get("http://tarunlalwani.com")

        # print session_id
        # print executor_url


        # driver2 = webdriver.Remote(command_executor=executor_url, desired_capabilities={})
        # driver2.session_id = session_id
        # print driver2.current_url
        # self.driver = webdriver.Chrome()
        # self.driver = webdriver.Firefox('C:\\ProgramInstall\\firefoxdriver\\geckodriver.exe')

    def parse(self, response):
        if('m.polyt.cn/detail' in response.url):
            self.driver.get(response.url)

            time.sleep(random.randint(1,2))
            # 如果有弹出安装app button，点击取消
            WebDriverWait(self.driver, 10).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR, ".van-button.van-dialog__cancel"))
            )
            self.driver.find_element_by_css_selector('.van-button.van-dialog__cancel').click()
            # 点击购票
            self.driver.find_element_by_css_selector('.btn-show-ticket.van-button').click()
            logging.debug('已点击购票')
            # first url callback here
            time.sleep(2000 + random.randint(1,5))
            self.driver.save()
        else:
            listSelector = response.css('div.infocard__container__item__main')
            if(listSelector == None or len(listSelector) == 0):
                logging.error('detail_page_load_wrong, url is: ' + response.url)
                return
            type = listSelector[0].css('::text').get().strip()
            serviceAreaEle = listSelector[1]
            serviceArea = ''
            for i, item in enumerate(serviceAreaEle.css('a::text')):
                serviceArea = serviceArea+ item.get().strip() + ' '
            serviceArea.strip()

            nameSelector = response.css('div.infocard__container__item--contact div.infocard__container__item__main::text')
            name = nameSelector.get().strip()
            addressSelector = response.css('div.infocard__container__item--shopaddress div.infocard__container__item__main')

            address = ''
            for i,item in enumerate(addressSelector[0].css('a::text')):
                address = address + item.get().strip() + ' '
            address = address.strip()

            phone = ''
            phoneSelector = response.css('div.tel_num.clearfix span.num_cont::text')
            if(phoneSelector != None and len(phoneSelector) > 0):
                phone = phoneSelector.get()
            phoneSelector = response.css('div.dialog_phone div.nowlt_tel span::text')
            if(phoneSelector != None and len(phoneSelector) > 0):
                phone = phoneSelector.get().split(' ')[1]
            yield {
                'type': type,
                'serviceArea': serviceArea,
                'name': name,
                'address': address,
                'phone': phone,
                'sourceId': 5
            }
        urlTest = ""

