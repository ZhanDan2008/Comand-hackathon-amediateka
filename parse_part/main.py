from bs4 import BeautifulSoup
import requests
import csv
def get_html(url):
    """получаем html код с страницы,но он непонятный и внем нельзя сориентироваться"""
    #получаем непонятную кашу из html
    response=requests.get(url)
    return response.text
def get_soup(html):
    """делаем код более понятным"""
    #делаем html код более понятным
    soup=BeautifulSoup(html,'html.parser')
    return soup
def get_films(soup):
    a = soup.find("div",class_='VideoLineHeader_videoLineHeader__O76C4')
    return a
link_of_main_page = 'https://www.amediateka.ru/'
f = get_html(link_of_main_page)
g = get_soup(f)
print(get_films(g))
