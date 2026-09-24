"""One-time extraction of the public LC page captured September 24, 2026.
Run with BeautifulSoup available and /tmp/lc-reference.html downloaded.
Only inert markup is retained; production scripts and forms are removed.
"""
from bs4 import BeautifulSoup, Comment
from pathlib import Path
from urllib.parse import urljoin
import copy, json

root = Path(__file__).resolve().parent.parent
s = BeautifulSoup(Path('/tmp/lc-reference.html').read_text(), 'html.parser')
cards = {}
for card in s.select('.event-with-image-and-description'):
    a = card.select_one('.event-title a')
    if a: cards.setdefault(a['href'].split('/')[-1], card)

fall = [
('in-concert-shuffle-along','September 27 - September 28'),
('living-memories-a-sonic-journey-through-san-juan-hill-734','October 09 at 7:30 pm'),
('over-my-head-i-hear-freedom-in-the-air-604','October 14 at 7:30 pm'),
('urban-love-suite-865','October 16 at 7:30 pm'),
('fujiororororororta-andamp-ka-baird-actress-team-rolfes','October 21 at 7:30 pm'),
('hania-rani-presents-non-fiction','October 23 at 7:30 pm'),
('ambrose-akinmusire-and-aszure-barton','October 28 - October 30'),
('de-papel-848','November 06 - November 08'),
('nemanja-radulovic-andamp-double-sens-66','November 10 at 7:30 pm'),
('rain-for-babies-and-their-carers','November 20 - November 22'),
('cosmo-114','December 11 - December 13')]
winter=[('netta-yerushalmy-895','January 06 - January 07'),('heidi-latsky-dance-571','January 09 - January 10'),('hannah-garner-2nd-best-dance-company-501','January 12 at 7:30 pm')]
for day in [13,14,15,16,17,19,20,21,22,23,24]:
    winter += [(slug,f'January {day} - Multiple times') for slug in ['blur-268','empire-at-sea-840']]
    if day==13: winter.append(('omar-romandaacuten-de-jesanduacutes-or-boca-tuya-345','January 13 - January 14'))
    if day==17: winter += [('globalfest-320','January 17 at 7:00 pm'),('shamel-pitts-or-tribe','January 17 - January 18')]
    if day==20: winter.append(('juilliard-dance-543','January 20 at 7:30 pm'))
winter.append(('wakka-wakkaandrsquos-dead-as-a-dodo-26','January 29 - January 30'))
for month,days in [('January',[30,31]),('February',[2,3,4,5,6,7,9,10,11,12,13,14,16,17,18,19,20,21])]:
    for day in days:
        winter.append(('playing-with-fire-an-immersive-odyssey-with-yuja-wang',f'{month} {day:02} - Multiple times'))
        if month=='January' and day==31: winter.append(('heartbeat-summit','January 31 at 1:00 pm'))
        if month=='February' and day==10: winter.append(('an-evening-with-wynton-marsalis-535','February 10 at 7:30 pm'))
        if month=='February' and day==13: winter.append(('la-vie-secrandegravete-des-vieux-the-secret-life-of-old-people-751','February 13 - February 14'))
winter.append(('kaki-king-andamp-glitch-present-bugs-24','February 26 - February 28'))
spring=[('dirt-428','March 05 - March 07'),('carmen-de-lavallade-a-life-in-motion-248','March 12 at 7:30 pm'),('trees','April 22 at 7:30 pm'),('la-obra-13','April 23 - April 25')]

out = BeautifulSoup('<!doctype html><html lang="en"><head></head><body class="overflow-x-hidden"></body></html>','html.parser')
out.body['id']='series-venue-page'
for tag in s.head.select('meta[name="viewport"],meta[charset],link[rel="stylesheet"],link[rel="icon"]'):
    if 'cookieconsent' not in str(tag):out.head.append(copy.deepcopy(tag))
out.head.append(BeautifulSoup('<title>Choose-What-You-Pay | Local LC Demo</title><meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="/demo.css">','html.parser'))
out.body.append(copy.deepcopy(s.select_one('#lcah-nav')))
main=out.new_tag('main');out.body.append(main)
wrapper=out.new_tag('div',id='lincoln-center-presents',attrs={'class':'main-vs-wrapper vs-obviously vs-landing'});main.append(wrapper)
for selector in ['.new-header-vs','.lnd-nav-callout','.quick-nav-bar','#cyp-wrapper']:
    wrapper.append(copy.deepcopy(s.select_one(selector)))
out.body.append(copy.deepcopy(s.footer))

events=[]
for group,listing in zip(out.select('.vs-cyp-group-shows-container'),[fall,winter,spring]):
    for slug,date in listing[:4]:
        original=cards[slug]
        card=out.new_tag('article',attrs={'class':'event-with-image-and-description','data-event':slug})
        image=copy.deepcopy(original.select_one('.event-date-and-image img'))
        image['alt']=original.select_one('.event-title').get_text(' ',strip=True)
        image['loading']='lazy'
        href=original.select_one('.event-title a')['href']
        picture=BeautifulSoup(f'<div class="event-date-and-image"><div class="event-date-wrapper"><h4 class="event-date">{date}</h4></div><a href="{href}"></a></div>','html.parser')
        picture.a.append(image);card.append(picture)
        details=out.new_tag('div',attrs={'class':'event-name-and-details-wrapper'})
        info=copy.deepcopy(original.select_one('.event-name-and-details'))
        for existing in info.select('.event-date-wrapper-in-details'):existing.decompose()
        venue=info.select_one('.more-venue-info')
        venue.insert_before(BeautifulSoup(f'<div class="event-date-wrapper-in-details"><h4 class="event-date-in-details">{date}</h4></div>','html.parser'))
        details.append(info)
        icons=original.select_one('.show-icons-container-standard,.show-icons-container-wide')
        if icons:
            icons=copy.deepcopy(icons);icons['class']=['show-icons-container-standard'];details.append(icons)
        details.append(BeautifulSoup(f'<div class="button-cont"><a class="ticket-button button" href="{href}">LEARN MORE</a></div>','html.parser'))
        card.append(details);card.append(details.select_one('.button-cont').extract());group.append(card)
        events.append({'slug':slug,'date':date,'title':image['alt'],'group':len(events)})

faq=out.select_one('[class*="elfsight-app-3881"]')
faq.replace_with(BeautifulSoup('''<details class="ticket-faq"><summary>Three ways to buy tickets</summary><div><p>There are three ways to purchase Choose-What-You-Pay tickets.</p><ol><li><strong>Book online</strong> from the event’s dedicated web page.</li><li><strong>Call CenterCharge</strong> at 212-721-6500 from Monday–Friday 10:00 am–6:00 pm (EST).</li><li><strong>Book in-person</strong> at the Alice Tully Hall box office (Broadway and 66th Street) or the David Geffen Hall Welcome Center from Monday–Saturday 10:00 am–6:00 pm and Sunday noon–6:00 pm.</li></ol></div></details>''','html.parser'))
for x in out.select('script,noscript,iframe,form,[class*="elfsight-app"]'):x.decompose()
for x in out.find_all(string=lambda x:isinstance(x,Comment)):x.extract()
for tag in out.find_all(True):
    for attr in list(tag.attrs):
        if attr.lower().startswith('on'):del tag[attr]
    # BeautifulSoup's HTML parser lowercases SVG attributes.
    for old,new in [('viewbox','viewBox'),('preserveaspectratio','preserveAspectRatio')]:
        if old in tag.attrs:tag[new]=tag.attrs.pop(old)
    for attr in ['href','src','mobilesrc']:
        if tag.get(attr) and not tag[attr].startswith(('data:','#','mailto:','tel:','/demo.')):
            tag[attr]=urljoin('https://www.lincolncenter.org',tag[attr]).replace('http://images.lincolncenter.org','https://images.lincolncenter.org')
    if tag.name=='a' and tag.get('href','').startswith('http'):
        tag['target']='_blank';tag['rel']='noopener noreferrer'
    if tag.name=='svg':
        tag['aria-hidden']='true'
        if tag.get('id'):del tag['id']
# The selected page must display without LC's production routing scripts.
out.select_one('#cyp-wrapper')['style']='display:block'
out.body.append(BeautifulSoup('<script src="/demo.js" defer></script>','html.parser'))
(root/'public/index.html').write_text(str(out))
(root/'data/event-inventory.json').write_text(json.dumps(events,indent=2,ensure_ascii=False))
print(f'Created baseline with {len(events)} event cards in {[min(4,len(fall)),min(4,len(winter)),min(4,len(spring))]} groups.')
