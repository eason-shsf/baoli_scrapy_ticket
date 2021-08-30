# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

class ScrapyBajPipeline(object):
    def __init__(self):
        print("init scrapy pipline")

    def process_item(self, item, spider):
        if(spider.name == "baj_ganji"):
            print("spider name is" + spider.name)
        elif(spider.name == "baj_zhuangyi"):
            print("spider name is" + spider.name)
        elif (spider.name == "baj_zsezt"):
            print("spider name is" + spider.name)
        elif (spider.name == "baj_chinadesigner"):
            print("spider name is" + spider.name)
        elif spider.name == "baj_58_html":
            print("spider name is" + spider.name)
        elif spider.name == "baj_baixing":
            print("spider name is" + spider.name)
        return item
