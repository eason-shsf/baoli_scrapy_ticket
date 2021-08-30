# -*- coding: utf-8 -*-
import scrapy


class Baj58Spider(scrapy.Spider):
    name = 'baj_58'
    allowed_domains = ['sh.58.com']
    start_urls = ['http://sh.58.com/']

    def parse(self, response):
        pass
