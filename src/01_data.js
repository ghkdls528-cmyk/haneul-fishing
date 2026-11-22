/* ================= 데이터 ================= */
// 등급: 0 잡동사니 1 일반 2 고급 3 희귀 4 영웅 5 전설 6 신화 7 히든
const RAR=[{n:'잡동사니',c:'#b8b0a2'},{n:'일반',c:'#9ccc65'},{n:'고급',c:'#4fc3f7'},{n:'희귀',c:'#a57fe0'},{n:'영웅',c:'#ff7a45'},{n:'전설',c:'#ffc531'},{n:'신화',c:'#ff5fae'},{n:'히든',c:'#3fe0d0'}];
const GOLD_BASE=[13,39,78,156,338,845,2080,2860]; // 4.18 전체 +30% // 4.14.3 히든 1300→2200 (조건·전투 난이도에 비해 신화보다 낮던 보상 보정)
const LOCS=[
 {id:'pier',n:'여수 선착장',ic:'⚓',lv:1,cost:0,w:'sea',plat:'pier',d:'잔잔한 항구. 귀여운 바다 친구들이 많아요',pv:'linear-gradient(#8fd3f4,#2a9bb5)',meth:['basic','float','lure','bottom','cast'],wx:['clear','cloudy','rain'],amb:'gull'},
 {id:'rock',n:'돌산 갯바위',ic:'🪨',lv:4,cost:1500,w:'sea',plat:'rock',d:'파도가 부서지는 바위. 돔 종류의 성지',pv:'linear-gradient(#a4c8d8,#2f7d8f)',meth:['basic','float','lure','bottom','cast'],wx:['clear','cloudy','rain','storm'],amb:'wave'},
 {id:'valley',n:'푸른 산속 계곡',ic:'🏞️',lv:6,cost:3000,w:'fresh',plat:'stone',d:'맑은 물이 흐르는 계곡. 쏘가리와 산천어',pv:'linear-gradient(#a8e6a0,#2f8a6a)',meth:['basic','float','lure'],wx:['clear','cloudy','rain'],amb:'bird'},
 {id:'light',n:'등대 방파제',ic:'🗼',lv:8,cost:5000,w:'sea',plat:'light',d:'밤이 아름다운 방파제. 갈치와 오징어',pv:'linear-gradient(#2b3f78,#0f2f55)',meth:['basic','float','lure','bottom','cast'],wx:['clear','cloudy','rain','storm'],amb:'wave'},
 {id:'lake',n:'신비로운 호수',ic:'🪷',lv:10,cost:8000,w:'fresh',plat:'dock',d:'물안개 낀 호수. 잉어·메기·철갑상어',pv:'linear-gradient(#c8d8f0,#3a7a8a)',meth:['basic','float','lure','bottom','cast'],wx:['clear','cloudy','rain'],amb:'frog'},
 {id:'sea',n:'먼바다 낚싯배',ic:'🚤',lv:13,cost:15000,w:'sea',plat:'boat',d:'끝없는 수평선. 초대형 어종과 폭풍',pv:'linear-gradient(#6fc3ff,#1565a8)',meth:['basic','float','lure','bottom','cast','deep'],wx:['clear','cloudy','rain','storm'],amb:'whale'},
 {id:'reef',n:'열대 산호초',ic:'🏝️',lv:16,cost:20000,w:'reef',plat:'beach',d:'에메랄드빛 바다. 알록달록 열대어',pv:'linear-gradient(#7ff0e0,#14a0b0)',meth:['basic','float','lure','bottom'],wx:['clear','clear','cloudy','rain'],amb:'bubble'},
 {id:'ice',n:'얼어붙은 빙하 호수',ic:'🧊',lv:19,cost:30000,w:'ice',plat:'ice',d:'얼음 구멍 낚시. 빙어와 거대 철갑상어',pv:'linear-gradient(#e8f6ff,#6aa8c8)',meth:['basic','float','bottom'],wx:['clear','cloudy','snow'],amb:'wind',req:{dex:40,t:'도감 40종 이상'}},
 {id:'deep',n:'깊은 심해',ic:'🌑',lv:22,cost:40000,w:'deep',plat:'boat',d:'빛이 닿지 않는 바다. 심해 낚시 전용',pv:'linear-gradient(#123a6a,#000814)',meth:['deep','basic'],wx:['clear'],amb:'deep',req:{meth:'deep',t:'심해 릴 장비 필요'}},
 {id:'moon',n:'신비한 달빛 바다',ic:'🌙',lv:28,cost:80000,w:'moon',plat:'boat',d:'영원한 밤의 바다. 신화 어종이 잠든 곳',pv:'linear-gradient(#3a3a9a,#0a0f30)',meth:['basic','float','lure','cast','deep'],wx:['clear','clear','meteor'],amb:'chime',night:1,req:{boss:1,dex:70,t:'보스 1회 처치 + 도감 70종'}}];
const LC={P:'pier',R:'rock',V:'valley',L:'light',K:'lake',S:'sea',T:'reef',I:'ice',D:'deep',M:'moon'};
const METHODS=[
 {id:'basic',n:'일반 낚시',ic:'🎣',price:0,d:'무난하게 모든 친구를 노려요'},
 {id:'float',n:'찌낚시',ic:'🔴',price:0,d:'찌가 잘 보여 챔질 판정 +0.1초 · 돔·붕어류 ↑'},
 {id:'bottom',n:'바닥낚시',ic:'⚓',price:800,d:'찌 대신 낚싯대 끝 방울이 울려요 · 바닥 친구 ↑'},
 {id:'lure',n:'루어낚시',ic:'🐟',price:1200,d:'기다리는 동안 탭해서 루어를 움직여야 물어요 · 사냥꾼 ↑'},
 {id:'cast',n:'원투낚시',ic:'🏹',price:2500,lv:5,d:'힘 게이지가 빨라 어렵지만 먼바다 친구 2.5배'},
 {id:'deep',n:'심해 낚시',ic:'🌊',price:8000,lv:18,d:'던질 힘만큼 깊이 내려가요(최대 300m) · 심해 전용 어종'}];
// [id,이름,등급,모양,'몸 배 지느러미',무늬,'최소-최대cm',힘,출현,'장소','방식',입질,저항,설명,추가]
const FD=[
 ['goby','망둥어',1,'fish','#d2ad72 #f7ead0 #b08850','spots','10-25',1,24,'P','nfb','nibble','steady','여수 갯가의 단골손님. 눈이 툭 튀어나왔어요.',{asp:.46,eye:'big'}],
 ['jeoneo','전어',1,'fish','#8db8e2 #f2f8ff #6d97c4','dots','15-30',1,18,'P','nfc','nibble','zigzag','가을이면 집 나간 며느리도 돌아온대요.',{asp:.5}],
 ['shrimp','대하',1,'shrimp','#ff9f7a #ffd8c4 #ff7f5a','','10-22',1,9,'P','nf','nibble','retreat','톡톡 튀는 탱글탱글 새우.'],
 ['star','불가사리',1,'star','#ff7aa2 #ffc2d4 #e65a85','','10-25',1,6,'PR','b','drag','float','바닥에서 낮잠 자다 걸렸어요.'],
 ['jjukkumi','주꾸미',1,'octo','#e59a8a #ffd0c4 #c9786a','','10-20',1,8,'P','bl','drag','ink','작지만 빨판 힘은 대단해요.',{tags:'ceph'}],
 ['mackerel','고등어',1,'fish','#3f92c4 #eef8ff #2f6f99','waves','25-45',2,14,'PL','lnc','slam','zigzag','등이 푸른 바다의 힘. 쉬지 않고 좌우로 달려요.',{asp:.42,tags:'pred'}],
 ['noraemi','노래미',2,'fish','#a8925a #f2e8c8 #86703c','spots','20-40',2,10,'PR','fb','nibble','steady','바위틈에 숨어 사는 수줍은 친구.',{asp:.5}],
 ['jelly','해파리',1,'jelly','#c9a8ff #efe4ff #a985ef','','15-40',1,5,'PL','n','drag','float','찌릿! 느릿느릿 떠다니다 걸렸어요.'],
 ['crab','꽃게',2,'crab','#ff7a59 #ffc0a8 #e85a3a','','10-22',2,7,'PR','b','drag','burst','옆으로 걷는 집게 대장.'],
 ['puffer','복어',2,'puffer','#f5cd52 #fff6d6 #e0a92a','','15-30',2,6,'PLT','nf','nibble','puff','화나면 빵빵! 풍선이 돼요.'],
 ['clown','흰동가리',3,'fish','#ff8d2e #ffb066 #ff7a12','bands','8-14',1,3,'PT','n','nibble','zigzag','말미잘 집에서 놀러 나온 손님.',{asp:.62}],
 ['seahorse','해마',3,'seahorse','#ffb347 #ffe0a8 #ff9a1f','','8-15',1,3,'PT','f','float','float','꼬리를 돌돌 말고 둥실둥실.'],
 ['rockfish','볼락',2,'fish','#c9604a #ffdccc #a2442f','stripes','15-30',2,6,'RL','fb','nibble','zigzag','밤이 되면 큰 눈을 반짝 떠요.',{asp:.6,eye:'big',night:3,rain:1.3}],
 ['octopus','돌문어',2,'octo','#d9786a #f6b4a6 #b85a4c','','30-70',3,5,'R','bl','drag','ink','먹물을 뿜으며 시야를 가려요.',{tags:'ceph'}],
 ['ssom','쏨뱅이',2,'fish','#d9533f #ffc9b0 #b23a28','spots','15-30',2,8,'R','b','nibble','burst','가시가 뾰족뾰족, 성격도 뾰족.',{asp:.56,dor:'spiky',eye:'big',mouth:'pout'}],
 ['bengeo','벵에돔',3,'fish','#3d4d72 #93a5cc #2a3654','','25-45',3,5,'R','f','float','zigzag','갯바위 낚시꾼의 로망, 까만 신사.',{asp:.62,tags:'dom'}],
 ['gamseong','감성돔',3,'fish','#74889a #e2e9ef #506373','stripes','30-55',4,4,'RL','f','float','burst','비 오는 날 잘 무는 바다의 귀족.',{asp:.68,tags:'dom',rain:1.8,far:1}],
 ['dolddom','돌돔',4,'fish','#d8dde2 #ffffff #3a3f48','bigstripes','30-55',5,1.6,'R','fb','float','strong','갯바위의 제왕. 줄무늬 정장 차림.',{asp:.7,tags:'dom',mouth:'beak'}],
 ['turtle','바다거북',4,'turtle','#5fb37f #f2e3a0 #4c9a6a','','40-80',4,1,'RST','n','drag','steady','인사만 하고 바로 놓아줬어요. 또 만나!'],
 ['jeongang','전갱이',1,'fish','#8fb7a8 #f0f8f4 #6d9688','scute','15-35',2,12,'L','lnc','slam','zigzag','떼로 몰려다니는 반짝이 친구.',{asp:.42,tags:'pred'}],
 ['squid','갑오징어',2,'squid','#efd9c6 #fff3e8 #d9b89c','','20-35',3,6,'L','l','drag','retreat','뒤로 쏙! 물을 뿜으며 후퇴해요.',{tags:'ceph',night:1.6}],
 ['samchi','삼치',2,'fish','#7fa9d2 #f2f7ff #5a86af','dots','50-90',3,5,'LS','lc','slam','zigzag','멀리 던져야 만나는 날쌘돌이.',{asp:.3,tags:'pred',far:1}],
 ['galchi','갈치',3,'eel','#e6eef8 #ffffff #b9cde2','','60-120',3,.5,'L','ln','drag','zigzag','여수 밤바다의 은빛 칼. 밤에 몰려와요.',{tags:'pred',night:16}],
 ['ray','가오리',3,'ray','#9886cf #d9d0f5 #7a68b3','','40-90',4,2,'LS','bc','drag','steady','바닷속을 날아다니는 담요.',{far:1}],
 ['moonjelly','달빛 해파리',7,'jelly','#9fe8ff #e8fbff #6fd0f0','','15-30',1,0,'L','n','drag','float','달빛을 머금고 은은하게 빛나요.',{glow:1,hid:'moonj'}],
 ['chamdom','참돔',4,'fish','#f47c8c #ffe3e8 #e05a6e','bluedots','40-80',5,1.6,'RLS','fb','float','strong','바다의 여왕. 일정한 힘으로 강하게 버텨요.',{asp:.7,tags:'dom',far:1}],
 ['bangeo','방어',3,'fish','#5b86b8 #eef4ff #4a6f99','yline','50-100',4,5,'S','l','slam','burst','겨울 바다의 기름진 근육맨.',{asp:.4,tags:'pred',tail:'lunate'}],
 ['mahi','만새기',3,'fish','#3fbf8f #ffe066 #2fa0d0','mahi','60-120',4,4,'ST','l','slam','jump','형광빛으로 반짝이며 수면 위로 튀어요.',{asp:.42,tags:'pred',dor:'long'}],
 ['sunfish','개복치',4,'sunfish','#a9b7c6 #e9eef4 #8796a8','','100-250',3,1.6,'S','n','float','float','멍~ 떠 있다가 걸렸어요. 살살 놓아줬어요.'],
 ['tuna','참다랑어',5,'fish','#2d4f86 #e7eef8 #1e3a66','tuna','100-250',5,.8,'S','lc','slam','charge','바다의 스포츠카. 강력한 돌진을 조심!',{asp:.5,tags:'pred',tail:'lunate',dor:'long'}],
 ['whale','고래상어',5,'fish','#5f84ab #dfe9f3 #4a6d92','wspots','300-600',5,.3,'S','n','drag','strong','세상에서 제일 큰 물고기가 인사하러 왔어요.',{asp:.4,mouth:'wide',far:1,wk:.03}],
 ['gold','황금 참돔',5,'fish','#ffcb3a #fff1b8 #f0a800','shine','60-100',5,.35,'RS','f','float','strong','전설로만 듣던 그 물고기!',{asp:.7,tags:'dom',far:1}],
 ['rainbow','무지개 참돔',7,'fish','#ff8fb1 #fff0f6 #9f7bff','rainbow','50-90',5,0,'*','f','float','burst','비 오는 노을빛을 온몸에 두른 기적의 물고기.',{asp:.7,hid:'rainbow'}],
 ['chest','보물상자',4,'chest','#b9773c #ffcf3f #a3662f','','30-40',3,1,'*','b','drag','steady','안에 금화가 가득!',{kg:8}],
 ['boot','낡은 장화',0,'boot','#7a5534 #4a3220 #9b7048','','25-30',1,3,'PRVK','b','drag','steady','…누가 여기 버렸어? 바다 청소 완료!',{kg:.9}],
 ['can','빈 캔',0,'can','#e8e8ee #ff5d5d #dfe1e8','','12-12',1,2.5,'PLS','n','nibble','steady','분리수거 완료! 바다가 고마워해요.',{kg:.02}],
 // 바다 신규
 ['gwangeo','광어',2,'flat','#8a7a5a #f5efe0 #6e5e40','spots','30-70',3,8,'PRL','b','drag','hide','바닥에 납작 숨어 있다가 갑자기 튀어나와요.'],
 ['gajami','가자미',1,'flat','#a89060 #f8f2e4 #8a7448','dots','15-35',1,10,'P','b','drag','hide','모래와 똑같은 색으로 숨바꼭질 중.'],
 ['dodari','도다리',1,'flat','#9a8a6a #fbf6ea #7a6a4a','','15-30',1,8,'PR','b','drag','hide','봄 도다리 쑥국의 주인공.'],
 ['ureok','우럭',1,'fish','#4a4a4a #9a9a92 #3a3a3a','stripes','20-45',2,14,'RL','bf','nibble','dive','바위 밑으로 쑥 파고들어요.',{asp:.55,tail:'round',eye:'big',mouth:'pout',night:1.5}],
 ['nongeo','농어',2,'fish','#8aa0b4 #f2f6fa #6a8094','dots','40-90',3,7,'PRL','lc','slam','jump','바늘을 털려고 수면 위로 펄쩍!',{asp:.38}],
 ['busiri','부시리',3,'fish','#5c86b0 #f0f6ff #46709a','yline','70-140',4,4,'S','lc','slam','charge','방어의 날쌘 사촌. 쭉 뻗는 돌진!',{asp:.36,tags:'pred',tail:'lunate'}],
 ['hwangdara','황다랑어',4,'fish','#2f5a8c #e9f0f8 #ffd23f','tuna','80-180',5,1.5,'S','lc','slam','charge','노란 지느러미의 바다 질주꾼.',{asp:.48,tags:'pred',tail:'lunate',dor:'long'}],
 ['gadara','가다랑어',2,'fish','#36507a #eef2f8 #24406a','bellystripes','30-70',3,8,'S','lc','slam','zigzag','배에 줄무늬가 있는 가쓰오부시 친구.',{asp:.48,tags:'pred',tail:'lunate'}],
 ['marlin','청새치',5,'billfish','#2f5f9a #e6f0fa #3a7ac8','vstripes','180-350',6,.25,'S','lc','slam','jump','창 같은 주둥이로 수면 위를 크게 날아올라요.',{tags:'pred',far:1}],
 ['swordfish','황새치',5,'billfish','#5a5a7a #d8d8e8 #44445e','','150-300',6,.25,'SD','cd','slam','dive','칼 주둥이로 깊이 깊이 파고들어요.',{tags:'pred',night:2,sword:1}],
 ['angler','아귀',3,'angler','#7a5a3a #c9a87a #5a4026','spots','40-100',3,3,'SD','bd','drag','hide','이마의 초롱으로 먹이를 유혹해요.',{depth:50}],
 ['jwichi','쥐치',1,'file','#c9b07a #f2e6c4 #a88a50','dots','15-30',1,10,'PRL','nf','nibble','zigzag','쪼끄만 입으로 미끼를 쏙쏙 훔쳐 먹어요.'],
 ['ojing','살오징어',2,'squidL','#f2c4b0 #fff0e8 #e0a088','','20-40',2,8,'LS','l','drag','retreat','밤바다 집어등에 모여드는 오징어.',{tags:'ceph',night:1.8}],
 ['giantoct','대문어',3,'octo','#c0504a #f0a090 #9a3a34','','60-150',4,2,'RS','b','drag','ink','먹물 한 방이면 앞이 캄캄!',{tags:'ceph',big:1}],
 ['nolraegi','놀래기',1,'fish','#7fc86a #f2f8d0 #5aa848','scribble','15-25',1,9,'PR','nf','nibble','zigzag','알록달록 낙서 무늬 개구쟁이.',{asp:.4}],
 ['hakgong','학꽁치',1,'fish','#9ac4e0 #f4fbff #7aa4c0','','20-35',1,9,'L','f','nibble','zigzag','아랫부리가 길쭉한 은빛 친구.',{asp:.2,feat:'beak'}],
 ['seongdae','성대',2,'fish','#e0704a #ffd8c0 #4ab0ff','','25-45',2,4,'RS','b','drag','steady','파란 날개 지느러미로 바닥을 걸어요.',{asp:.45,feat:'wings'}],
 ['jogi','참조기',2,'fish','#e8c060 #fff4d0 #d0a040','','20-35',2,7,'L','nf','nibble','steady','노란 배가 반짝, 굴비가 될 운명?',{asp:.4}],
 ['byeongeo','병어',2,'fish','#d0d8e0 #f8fbff #b0bcc8','','15-30',2,6,'S','n','nibble','zigzag','동글납작 은빛 원반.',{asp:.85,tail:'fork',eye:'small',mouth:'pout'}],
 ['hongeo','홍어',3,'ray','#a07a6a #f0d8c8 #84604e','spots','50-100',4,2,'S','b','drag','steady','넓적한 날개로 바닥에 착 붙어요.'],
 ['gomchi','곰치',3,'moray','#6a7a3a #c8d090 #4e5a28','leopard','60-150',4,2,'RT','b','drag','hide','바위틈에서 입을 벌리고 기다려요.'],
 ['bungjang','붕장어',2,'eel','#8a7050 #e8d8b8 #6a5438','','40-90',3,5,'PL','b','drag','dive','밤마다 바닥을 헤집고 다녀요.',{night:1.5}],
 ['nalchi','날치',2,'fish','#5a9ad0 #eef6ff #8ac4f0','','20-35',2,5,'ST','n','slam','jump','바다 위를 나는 물고기!',{asp:.35,feat:'wings'}],
 // 민물
 ['bungeo','붕어',1,'fish','#b0a060 #f0e8c0 #8a7a40','scales','10-35',1,20,'VK','nfb','nibble','steady','민물 낚시의 기본. 통통하고 순해요.',{asp:.55,tail:'round'}],
 ['ingeo','잉어',2,'fish','#c89a40 #f8e8b0 #a87a28','scales','40-90',3,8,'K','fb','float','strong','수염이 멋진 호수의 큰형님.',{asp:.45,feat:'barbel'}],
 ['hyangeo','향어',2,'fish','#6a6a5a #c8c8b8 #4e4e40','','40-80',3,6,'K','fb','nibble','strong','비늘 없는 매끈한 잉어 사촌.',{asp:.5,feat:'barbel'}],
 ['megi','메기',2,'catfish','#5a5040 #c0b098 #403828','','40-100',3,5,'K','b','drag','dive','긴 수염으로 진흙 바닥을 더듬어요.',{night:2}],
 ['ppaga','빠가사리',1,'catfish','#c09040 #f0d890 #a07020','','10-25',2,8,'VK','b','nibble','steady','빠각빠각 우는 노란 수염 친구.',{small:1}],
 ['sogari','쏘가리',3,'fish','#d0a050 #f8e8c0 #a87a30','leopard','20-50',3,4,'V','lf','slam','burst','계곡의 호랑이. 표범 무늬가 멋져요.',{asp:.4,dor:'spiky',mouth:'teeth',tags:'pred'}],
 ['bass','배스',2,'fish','#6a8a4a #e8f0c8 #4e6e34','bassline','25-55',3,8,'K','l','slam','jump','입이 엄청 커요! 루어를 덥석.',{asp:.45,mouth:'gape',tags:'pred'}],
 ['bluegill','블루길',1,'fish','#6a8aa0 #f0c060 #4a6a80','','10-22',1,12,'K','nf','nibble','zigzag','귀에 까만 점이 있는 동글이.',{asp:.75,feat:'earflap'}],
 ['trout','송어',2,'fish','#8aa070 #f6e0e0 #6a8050','redband','25-60',3,8,'VI','lf','slam','jump','무지개 띠를 두른 계곡의 점프왕.',{asp:.38,tags:'pred'}],
 ['sancheon','산천어',3,'fish','#7a90a8 #f2f4f8 #5a7088','parr','20-35',2,5,'V','lf','slam','zigzag','맑은 계곡의 요정, 몸에 동글 무늬.',{asp:.38}],
 ['pirami','피라미',1,'fish','#9ab8d0 #f8fbff #7a98b0','pinkstripe','8-15',1,20,'V','nf','nibble','zigzag','여울에서 반짝반짝 떼 지어 놀아요.',{asp:.32}],
 ['eun','은어',2,'fish','#a8c0a0 #f6faf0 #88a080','dots','15-25',2,8,'V','f','nibble','zigzag','수박 향이 나는 은빛 물고기.',{asp:.3}],
 ['jangeo','뱀장어',3,'eel','#4a5a3a #c8d0a0 #34402a','','50-100',3,3,'K','b','drag','dive','깊은 밤, 진흙 속으로 쏙 숨어요.',{night:3}],
 ['sturgeon','철갑상어',4,'sturgeon','#7a8a94 #dfe6ea #5a6a74','','100-200',5,.8,'KI','b','drag','strong','공룡 시대부터 살아온 갑옷 물고기.'],
 ['gamulchi','가물치',3,'fish','#4a4a3a #a8a890 #3a3a2a','snake','40-80',4,3,'K','l','slam','burst','뱀 무늬의 늪지대 사냥꾼.',{asp:.32,tail:'round',mouth:'teeth',tags:'pred'}],
 ['kkeokji','꺽지',2,'fish','#6a7a5a #c0c8a8 #4e5e40','spots','10-20',2,7,'V','nf','nibble','burst','바위에 숨어 텃세 부리는 꼬마 대장.',{asp:.45,dor:'spiky',eye:'angry'}],
 ['beodeul','버들치',1,'fish','#a8a080 #f0ecd8 #888060','dots','8-15',1,14,'V','n','nibble','zigzag','버들잎처럼 날씬한 계곡 친구.',{asp:.33}],
 ['goldfish','금붕어',2,'fish','#ff8a3d #ffd0a0 #ff6a1a','','8-15',1,3,'K','n','nibble','float','누가 호수에 풀어줬나 봐요.',{asp:.6,tail:'fan',eye:'big'}],
 ['napjaru','납자루',2,'fish','#a0b0c0 #ffd0e0 #ff7aa0','','6-10',1,6,'V','n','nibble','zigzag','분홍빛 혼인색이 고운 작은 물고기.',{asp:.55}],
 // 열대
 ['butterfly','나비고기',2,'fish','#ffe14a #fff8d0 #ffcf1a','eyespot','10-18',1,10,'T','n','nibble','zigzag','꼬리 쪽 가짜 눈으로 적을 속여요.',{asp:.85,feat:'snout'}],
 ['angel','엔젤피시',3,'fish','#4a7aff #ffe066 #ffd23f','angel','15-30',2,5,'T','nf','nibble','float','긴 지느러미를 우아하게 펼쳐요.',{asp:.95,dor:'sail'}],
 ['bluetang','블루탱',2,'fish','#3a7ae8 #ffe066 #1a4ab0','tang','15-30',2,8,'T','n','nibble','zigzag','까먹기 대장 파란 물고기.',{asp:.7}],
 ['chromis','파랑돔',1,'fish','#3ac0ff #c0f0ff #1a90d0','','5-10',1,14,'T','n','nibble','zigzag','산호 위를 파랗게 물들이는 떼.',{asp:.5}],
 ['boxfish','노랑거북복',2,'box','#ffd23f #fff6c0 #e0b010','dots','8-18',1,6,'T','n','nibble','float','네모난 몸으로 뒤뚱뒤뚱 헤엄쳐요.'],
 ['lionfish','쏠배감펭',3,'fish','#e8604a #fff0e8 #d04a34','lionstripe','20-35',3,4,'T','nb','nibble','burst','부채 같은 가시 지느러미를 활짝!',{asp:.55,dor:'spiky',feat:'lion'}],
 ['parrot','앵무고기',2,'fish','#3ad0a0 #ffc0e0 #ff7ab0','scales','30-60',3,6,'T','n','nibble','steady','부리로 산호를 아작아작.',{asp:.5,mouth:'beak'}],
 ['nudi','갯민숭달팽이',2,'nudi','#a06aff #ffd0ff #ff9a3a','','3-8',1,4,'T','b','drag','float','바닷속을 기어 다니는 보석.'],
 ['urchin','성게',1,'urchin','#5a3a7a #a87ad0 #3a2a5a','','5-12',1,6,'TR','b','drag','float','가시 조심! 속은 의외로 말랑.'],
 ['clam','대왕조개',3,'clam','#7ad0c8 #f0fff8 #4ab0a8','','30-80',3,1.5,'T','b','drag','steady','진주를 품고 있어요. 골드 보너스!',{kg:0}],
 ['manta','만타가오리',4,'manta','#2b3550 #f0f4fa #1a2236','','300-600',5,.6,'T','n','drag','float','거대한 날개로 우아하게 날아요.',{wk:.002}],
 ['hammer','귀상어',4,'hammer','#7a8a9a #e8eef2 #5a6a7a','','150-350',5,.7,'TS','lc','slam','charge','망치 머리로 바다를 휘젓는 사냥꾼.',{tags:'pred'}],
 ['dolphin','돌고래',5,'dolphin','#7ab0e0 #eef6ff #5a90c0','','150-250',5,.35,'TS','n','slam','jump','장난치다 걸렸어요. 인사하고 보내줘요.',{wk:.02}],
 ['orca','범고래',6,'orca','#1a1a24 #ffffff #1a1a24','','500-800',6,.08,'S','n','slam','charge','바다의 진짜 왕. 신화 등급 손님!',{wk:.012,far:1}],
 // 심해
 ['lantern','초롱아귀',3,'angler','#3a2a4a #7a5a8a #2a1a3a','','10-30',2,5,'D','d','drag','hide','어둠 속에서 초롱이 반짝반짝.',{glow:1,depth:150}],
 ['dumbo','덤보문어',4,'dumbo','#ff9ab0 #ffd8e0 #ff7a98','','15-30',2,2,'D','d','float','float','귀 같은 지느러미로 팔랑팔랑.',{depth:200}],
 ['blob','블롭피쉬',3,'blob','#f0b0b0 #ffe0e0 #e09090','','20-30',1,4,'D','d','drag','float','물 밖에선 시무룩… 그래도 귀여워요.',{depth:100}],
 ['oarfish','산갈치',5,'oar','#d8e0f0 #ffffff #ff4a5a','','300-800',5,.4,'D','d','drag','dive','붉은 갈기의 바다 용. 전설의 심해어.',{depth:150,wk:.0008}],
 ['coel','실러캔스',5,'fish','#3a5a8a #8aa8d0 #2a4a7a','wspots','100-200',5,.4,'D','d','drag','strong','4억 년을 살아온 살아있는 화석.',{asp:.45,tail:'lobe',feat:'lobe',depth:200}],
 ['dshrimp','심해 새우',1,'shrimp','#ff4a4a #ff9a8a #e02a2a','','8-20',1,14,'D','d','nibble','retreat','심해는 온통 빨간 친구들.',{depth:50}],
 ['hatchet','앨퉁이',2,'hatchet','#c0c8d8 #f0f4ff #8a94a8','','5-10',1,10,'D','d','nibble','zigzag','배에서 파란빛이 나는 손도끼 물고기.',{glow:1,depth:100}],
 ['viper','바이퍼피시',3,'fish','#2a3a4a #6a8aa0 #1a2a3a','','20-35',3,4,'D','d','slam','burst','이빨이 무시무시… 하지만 표정은 순해요.',{asp:.25,mouth:'teeth',glow:1,depth:150}],
 ['firesquid','반딧불오징어',2,'squidL','#3a6aff #a0c0ff #2a4ad0','','5-10',1,10,'DM','dl','drag','retreat','온몸에 파란 불빛 점이 반짝.',{glow:1,depth:50,tags:'ceph'}],
 ['isopod','대왕구족충',3,'isopod','#d8c8b0 #f4ece0 #b0a088','','20-45',2,3,'D','d','drag','steady','공벌레의 거대한 바다 사촌.',{depth:150}],
 ['glass','유리 물고기',3,'fish','#c0f0ff #ffffff #a0e0ff','','10-20',1,4,'D','d','nibble','float','몸이 투명해서 뼈가 다 보여요.',{asp:.45,feat:'glass',depth:100}],
 ['gulper','풍선장어',4,'gulper','#2a2a3a #6a6a8a #1a1a2a','','50-100',3,1,'D','d','drag','dive','입이 몸보다 커요!',{depth:250}],
 ['deepeye','심해의 눈',7,'eyeball','#6a4aa0 #ffffff #4a2a80','','20-40',3,0,'D','d','drag','float','가장 깊은 곳에서 무언가 지켜보고 있었어요.',{hid:'deep300',glow:1}],
 // 빙하
 ['bingeo','빙어',1,'fish','#c8e0f0 #ffffff #a8c8e0','','8-15',1,24,'I','nf','nibble','zigzag','얼음 구멍 낚시의 단골. 투명한 몸.',{asp:.28,feat:'glass'}],
 ['capelin','열빙어',1,'fish','#8ab0c8 #f0f8ff #6a90a8','','12-20',1,14,'I','n','nibble','zigzag','알을 가득 품은 시샤모.',{asp:.3}],
 ['char','북극곤들매기',3,'fish','#5a7a5a #ff8a5a #ffffff','charspots','30-70',3,4,'I','lf','slam','burst','빨간 배와 하얀 지느러미가 멋져요.',{asp:.38}],
 ['cod','대구',2,'fish','#8a7a5a #f0e8d0 #6a5a3a','spots','40-90',3,6,'I','b','drag','dive','입이 커서 대구! 턱수염도 있어요.',{asp:.45,feat:'barbel',mouth:'gape'}],
 ['pollock','명태',2,'fish','#7a8aa0 #eef2f6 #5a6a80','','30-60',2,8,'I','b','nibble','zigzag','이름이 열 개도 넘는 국민 생선.',{asp:.35}],
 ['icefish','얼음 물고기',3,'fish','#bfe8ff #ffffff #9fd8ff','','20-40',2,3,'I','f','nibble','float','피가 투명한 남극의 물고기.',{asp:.32,feat:'crystal'}],
 ['snowjelly','눈송이 해파리',2,'jelly','#e8f6ff #ffffff #bfe0ff','','10-20',1,5,'I','n','drag','float','눈 결정 무늬가 새겨진 해파리.'],
 ['kingcrab','대게',3,'crab','#d0603a #ffd0b0 #b04a28','','30-60',3,3,'I','b','drag','burst','다리가 대나무처럼 길쭉!',{long:1}],
 ['fairy','얼음 요정 물고기',7,'fish','#e0f8ff #ffffff #b0e8ff','','15-25',2,0,'I','f','float','float','눈 내리는 밤에만 나타나는 요정.',{asp:.5,feat:'crystal',wing:1,glow:1,hid:'snownight'}],
 // 달빛
 ['starray','별빛 가오리',3,'ray','#3a4aa0 #a0b0ff #2a3a80','stars','50-100',3,5,'M','nl','drag','float','등에 별자리가 새겨져 있어요.',{glow:1}],
 ['galaxy','은하수 송사리',2,'fish','#5a6ad0 #c0d0ff #8a9aff','stars','5-10',1,16,'M','n','nibble','zigzag','은하수에서 헤엄쳐 온 꼬마.',{asp:.4,glow:1}],
 ['rabbit','달토끼 물고기',4,'fish','#f6f0ff #ffffff #d8c8ff','','20-40',2,3,'M','f','float','float','귀가 쫑긋, 달에서 떨어진 걸까요?',{asp:.55,feat:'ears',eye:'sparkle'}],
 ['meteel','유성 장어',4,'eel','#ffd23f #fff6c0 #ff9a1a','','60-120',4,2,'M','lc','slam','zigzag','꼬리에 불꽃을 달고 쌩!',{glow:1}],
 ['crystal','크리스탈 피쉬',3,'fish','#a0f0ff #ffffff #ff9ff0','','15-30',2,5,'M','f','nibble','float','보석처럼 각진 몸이 반짝여요.',{asp:.5,feat:'crystal'}],
 ['aurora','오로라 잉어',5,'fish','#7affc0 #c0f0ff #b07aff','aurora','50-100',4,1,'M','f','float','strong','몸에서 오로라가 일렁여요.',{asp:.45,feat:'barbel'}],
 ['dwhale','꿈꾸는 고래',6,'dwhale','#6a7ad8 #e0e6ff #4a5ab0','','800-1500',6,.08,'M','n','drag','float','잠든 채로 꿈속을 헤엄쳐요. 신화 등급!',{wk:.008}],
 ['dragon','바다용',6,'dragon','#3ad0a0 #e0fff0 #ffd23f','','200-400',6,.06,'SM','lc','slam','charge','구름을 부르는 바다의 수호신.',{wk:.01}],
 ['meteorf','별똥별 물고기',7,'fish','#fff3a0 #ffffff #ffb84a','stars','15-30',3,0,'*','n','slam','zigzag','별똥별과 함께 떨어진 물고기.',{asp:.5,feat:'tailstar',glow:1,hid:'meteor'}],
 // 히든·기타
 ['goldcarp','황금 잉어',7,'fish','#ffd23f #fff6c0 #ffb000','scales','40-80',4,0,'K','fb','float','strong','황금 물고기가 나타날 때만 수면에 비친대요.',{asp:.45,feat:'barbel',hid:'goldcarp'}],
 ['ghost','유령 고등어',7,'fish','#c8d8ff #ffffff #a0b8ff','waves','25-45',2,0,'L','n','slam','zigzag','비 오는 밤 방파제에 스르르…',{asp:.42,ghost:1,hid:'ghost'}],
 ['thunder','번개 물고기',7,'fish','#ffe14a #fffbe0 #5a6aff','zap','40-70',5,0,'S','lc','slam','burst','폭풍우 속에서만 번쩍 나타나요.',{asp:.45,glow:1,hid:'storm'}],
 ['weed','해초 뭉치',0,'weed','#3fa66b #8ad0a0 #2f8a5a','','20-40',1,2.5,'*','n','drag','steady','미역국 한 그릇은 나오겠어요.',{kg:.4}],
 ['bottle','편지 병',0,'bottle','#9fe0c8 #fff3d0 #5ab090','','20-25',1,1.2,'PSTM','n','drag','float','유리병 속 편지: "오늘도 대어를 낚길!" (보너스 골드)',{kg:.5}],
 // 보스
 ['kraken','심해의 대왕오징어',6,'giantsquid','#c0405a #f6a0b0 #8a2a40','','500-1200',7,0,'D','d','drag','boss','심해의 지배자. 세 단계로 저항하는 보스.',{boss:'kraken',wk:.0003}],
 ['goldking','전설의 황금참돔 왕',5,'fish','#ffcb3a #fff1b8 #f0a800','shine','120-180',7,0,'R','f','float','boss','황금 왕관을 쓴 참돔의 왕.',{asp:.7,feat:'crown',boss:'goldking'}],
 ['whaleking','바다의 지배자',5,'fish','#3f6a9a #dfe9f3 #2a4f7a','wspots','900-1300',7,0,'S','n','drag','boss','고래상어 무리의 우두머리.',{asp:.4,mouth:'wide',feat:'crown',boss:'whaleking',wk:.006}],
 ['stormmarlin','폭풍의 청새치',5,'billfish','#3a3a8a #d8e0ff #ffe14a','zap','300-450',7,0,'S','lc','slam','boss','번개를 두르고 폭풍을 가르는 청새치.',{boss:'stormmarlin'}],
 ['icesturgeon','거대 철갑상어',5,'sturgeon','#9ac8e0 #f0faff #6aa0c0','','300-450',7,0,'I','b','drag','boss','얼음 호수 밑바닥의 수호자.',{boss:'icesturgeon'}],
 ['moonqueen','달을 먹는 해파리',6,'jelly','#c0a8ff #fff0ff #8a6aff','','150-250',7,0,'M','n','drag','boss','달빛을 삼켜 빛나는 해파리 여왕.',{glow:1,feat:'crown',boss:'moonqueen',kg:60}]];
const SHAPE_WK={fish:.012,flat:.015,eel:.0015,octo:.02,crab:.03,shrimp:.008,star:.01,jelly:.006,puffer:.025,squid:.03,squidL:.02,seahorse:.01,ray:.03,turtle:.03,sunfish:.04,billfish:.006,angler:.03,file:.015,moray:.003,catfish:.012,sturgeon:.01,box:.02,nudi:.01,urchin:.03,manta:.002,hammer:.01,dolphin:.02,orca:.012,dumbo:.02,blob:.02,oar:.0008,hatchet:.01,isopod:.03,gulper:.003,eyeball:.03,dwhale:.008,dragon:.01,giantsquid:.0003,weed:0,bottle:0,boot:0,can:0,chest:0};
const FISH=FD.map(a=>{const[id,n,r,k,cols,pat,sz,p,w,locs,meth,bp,fm,d,ex]=a;const[c,b,f]=cols.split(' ');const[min,max]=sz.split('-').map(Number);const o=Object.assign({id,n,r,k,c,b,f,pat,min,max,p,w,bp,fm,d,loc:locs==='*'?LOCS.map(l=>l.id):locs.split('').map(x=>LC[x]),m:meth,asp:.5},ex||{});o.tags=(o.tags||'').split(',').filter(Boolean);if(o.wk==null)o.wk=SHAPE_WK[k]??.012;return o});
const FID={};FISH.forEach(f=>FID[f.id]=f);
const BAITS=[
 {id:'worm',n:'지렁이',ic:'🪱',price:0,d:'무난한 기본 미끼 · 일반 친구 ↑'},
 {id:'shrimpb',n:'새우 미끼',ic:'🦐',price:600,d:'돔 종류 2배 · 고급 이상 조금 ↑'},
 {id:'krill',n:'크릴 밑밥',ic:'🍤',price:1500,d:'입질이 30% 빨라짐 · 고급·희귀 ↑'},
 {id:'egi',n:'에기',ic:'🦑',price:2000,d:'문어·오징어류 3배'},
 {id:'lure',n:'메탈 루어',ic:'🐟',price:2500,d:'고등어·삼치 같은 사냥꾼 2.5배'},
 {id:'paste',n:'떡밥',ic:'🍙',price:900,d:'민물 붕어·잉어류 2.5배'},
 {id:'goldb',n:'황금 미끼',ic:'✨',price:400,cons:1,d:'1회용 · 영웅 이상 3배, 변종·초대형 확률 2배'}];
const BOBS=[
 {id:'red',n:'기본 찌',price:0,c1:'#ff4d3d',c2:'#fff',d:'믿음직한 빨간 찌'},
 {id:'yellow',n:'노란 찌',price:800,c1:'#ffcf2f',c2:'#fff',d:'잘 보여서 입질 반응 시간 +0.15초'},
 {id:'heart',n:'하트 찌',price:1200,c1:'#ff7aa8',c2:'#fff',d:'꾸미기 · 콤보 보너스 +5%'},
 {id:'star',n:'별빛 찌',price:2500,c1:'#8c7bff',c2:'#fff3a0',d:'밤에 빛남 · 퍼펙트 판정 +0.12초'},
 {id:'goldbob',n:'황금 찌',price:-1,c1:'#ffcf3a',c2:'#fff6c0',d:'보스 보상 · 퍼펙트 +0.15초 · 골드 +10%'}];
const UPG=[
 {id:'rod',n:'낚싯대',ic:'🎣',d:'물고기가 당기는 힘 -7%/단계'},
 {id:'reel',n:'릴',ic:'⚙️',d:'감는 힘 +13%/단계'},
 {id:'line',n:'낚싯줄',ic:'🧵',d:'끊어지기 전 버티는 시간 +0.12초/단계'},
 {id:'hook',n:'바늘',ic:'🪝',d:'챔질 가능 시간 +4%/단계, 놓칠 확률 ↓'}];
const upPrice=lv=>Math.round(150*Math.pow(1.62,lv)/10)*10;
// 꾸미기
const COS={
 outfit:[{id:'default',n:'기본 베이지',price:0,hue:null},{id:'navy',n:'네이비 점퍼',price:1500,hue:220,sat:.45},{id:'pink',n:'벚꽃 점퍼',price:2000,hue:340,sat:.55},{id:'mint',n:'민트 점퍼',price:2000,hue:160,sat:.45},{id:'red',n:'빨강 구명조끼',price:2500,hue:5,sat:.7},{id:'moon',n:'달빛 의상',price:-1,hue:265,sat:.5,d:'보스 보상'}],
 hat:[{id:'cap',n:'기본 모자',price:0},{id:'straw',n:'밀짚모자',price:1200},{id:'beanie',n:'털모자',price:1500},{id:'bucket',n:'벙거지',price:1800},{id:'pirate',n:'선장 모자',price:3000},{id:'icecrown',n:'얼음 왕관',price:-1,d:'보스 보상'}],
 acc:[{id:'none',n:'없음',price:0},{id:'flower',n:'꽃핀',price:800},{id:'catears',n:'고양이 귀',price:1000},{id:'headphones',n:'헤드폰',price:2200},{id:'halo',n:'천사 링',price:4000}],
 rod:[{id:'basic',n:'기본 낚싯대',price:0,line:'rgba(255,255,255,.9)',d:'하얀 줄'},{id:'sakura',n:'벚꽃 로드',price:1500,line:'#ffb0cc',trail:'#ffc0d8',d:'분홍 줄 · 던질 때 꽃잎'},{id:'neon',n:'네온 로드',price:2500,line:'#6ff0ff',trail:'#6ff0ff',glow:1,d:'빛나는 하늘색 줄'},{id:'goldrod',n:'황금 로드',price:5000,line:'#ffd84a',trail:'#ffe680',d:'금빛 줄 · 반짝이 꼬리'},{id:'kraken',n:'크라켄 로드',price:-1,line:'#c070ff',trail:'#a050e0',glow:1,d:'보스 보상 · 보랏빛 촉수 장식'}],
 reel:[{id:'basic',n:'기본 릴',price:0,col:'#9dffb0',pitch:1,d:'초록 반짝이'},{id:'blue',n:'블루 릴',price:1200,col:'#7fc8ff',pitch:1.15,d:'파란 반짝이 · 맑은 소리'},{id:'goldreel',n:'골드 릴',price:3000,col:'#ffd23f',pitch:.85,d:'금빛 반짝이 · 묵직한 소리'},{id:'storm',n:'폭풍 릴',price:-1,col:'#fff36a',pitch:1.3,spark:1,d:'보스 보상 · 감을 때 번개 불꽃'}],
 boat:[{id:'basic',n:'기본 낚싯배',price:0,d:'믿음직한 흰 배'},{id:'duck',n:'오리 보트',price:6000,d:'꽥! 골드 +5%'},{id:'yacht',n:'미니 요트',price:9000,d:'돛을 단 요트 · 먼바다 친구 ↑'},{id:'whaleboat',n:'고래 보트',price:-1,d:'보스 보상 · 골드 +10%'}]};
const DECOS=[
 {id:'flower',n:'꽃 화분',ic:'🌼',price:700,d:'낚시터가 화사해져요'},
 {id:'flag',n:'깃발 가랜드',ic:'🎏',price:900,d:'바람에 펄럭펄럭'},
 {id:'cooler',n:'아이스박스',ic:'🧊',price:900,d:'잡은 물고기 보관용(꾸미기)'},
 {id:'parasol',n:'파라솔',ic:'⛱️',price:1200,d:'그늘 아래서 여유롭게'},
 {id:'lantern',n:'등불',ic:'🏮',price:1500,d:'밤이 되면 따뜻하게 빛나요'},
 {id:'moonlamp',n:'달빛 램프',ic:'🌙',price:-1,d:'보스 보상 · 은은한 달빛'}];
const PETS=[
 {id:'cat',n:'고양이',ic:'🐱',price:2000,d:'가끔 "냥!" 물고기를 먼저 발견해 입질이 빨라지고 희귀 확률 ↑'},
 {id:'seagull',n:'갈매기',ic:'🕊️',price:3000,d:'물고기 떼를 2배 자주 찾아내고 위치를 알려줘요'},
 {id:'penguin',n:'펭귄',ic:'🐧',price:4000,d:'빙하 호수 골드 +30%·입질 빨라짐, 다른 곳 +5%'},
 {id:'otter',n:'수달',ic:'🦦',price:5000,d:'골드 +12%, 가끔 조개를 주워 와요'}];
const BOSSES=[
 {id:'goldking',loc:'rock',lv:12,ph:['strong','zigzag','charge'],pn:['황금 비늘 버티기','좌우 황금 질주','왕의 돌진'],rew:{gold:5000,title:'황금 손',item:['bob','goldbob']}},
 {id:'whaleking',loc:'sea',lv:18,ph:['strong','dive','charge'],pn:['거대한 몸집','심해로 끌어당기기','바다를 가르는 돌진'],rew:{gold:8000,title:'바다의 친구',item:['boat','whaleboat']}},
 {id:'stormmarlin',loc:'sea',lv:22,ph:['zigzag','jump','charge'],pn:['폭풍 속 질주','번개 점프','폭풍의 일격'],rew:{gold:10000,title:'폭풍 사냥꾼',item:['reel','storm']},storm:1},
 {id:'icesturgeon',loc:'ice',lv:24,ph:['strong','dive','burst'],pn:['얼음 갑옷','호수 밑바닥으로','얼음 깨기 몸부림'],rew:{gold:12000,title:'얼음 호수의 왕',item:['hat','icecrown']}},
 {id:'kraken',loc:'deep',lv:28,ph:['strong','ink','charge'],pn:['촉수 휘감기','먹물 폭풍','심해의 분노'],rew:{gold:20000,title:'심해의 정복자',item:['rod','kraken']}},
 {id:'moonqueen',loc:'moon',lv:32,ph:['float','ink','zigzag'],pn:['달빛 춤','어둠 삼키기','월식의 소용돌이'],rew:{gold:25000,title:'달빛 낚시꾼',item:['outfit','moon'],deco:'moonlamp'}}];
const ACH=[
 {id:'a1',n:'첫 손맛',d:'물고기 1마리 낚기',ok:s=>s.count>=1,g:100},
 {id:'a2',n:'초보 낚시꾼',d:'30마리 낚기',ok:s=>s.count>=30,g:500},
 {id:'a3',n:'베테랑 낚시꾼',d:'150마리 낚기',ok:s=>s.count>=150,g:2500},
 {id:'a3b',n:'바다의 전설',d:'500마리 낚기',ok:s=>s.count>=500,g:10000,title:'바다의 전설'},
 {id:'a4',n:'도감 25%',d:'도감 25% 채우기',ok:()=>dexPct()>=25,g:800},
 {id:'a5',n:'도감 50%',d:'도감 50% 채우기',ok:()=>dexPct()>=50,g:3000},
 {id:'a5b',n:'도감 75%',d:'도감 75% 채우기',ok:()=>dexPct()>=75,g:8000},
 {id:'a6',n:'바다 박사',d:'도감 100% 완성',ok:()=>dexPct()>=100,g:50000,title:'바다 박사'},
 {id:'a7',n:'전설을 낚다',d:'전설 등급 낚기',ok:s=>s.st.legend>=1,g:3000},
 {id:'a7b',n:'신화의 목격자',d:'신화 등급 낚기',ok:s=>s.st.myth>=1,g:8000,title:'신화의 목격자'},
 {id:'a8',n:'초대형 사냥꾼',d:'초대형 물고기 낚기',ok:s=>s.st.giant>=1,g:800},
 {id:'a8b',n:'변종 수집가',d:'특수 변종 3번 낚기',ok:s=>s.st.variant>=3,g:2000,title:'변종 수집가'},
 {id:'a9',n:'퍼펙트 장인',d:'퍼펙트 챔질 25번',ok:s=>s.st.perfect>=25,g:1000},
 {id:'a10',n:'콤보 마스터',d:'8연속 성공',ok:s=>s.st.maxCombo>=8,g:1200,title:'콤보 마스터'},
 {id:'a11',n:'바다 탐험가',d:'낚시터 10곳 모두 해금',ok:s=>LOCS.every(l=>s.locs[l.id]),g:10000,title:'탐험가'},
 {id:'a12',n:'숨겨진 친구',d:'히든 물고기 발견',ok:s=>s.st.hidden>=1,g:2000},
 {id:'a12b',n:'히든 헌터',d:'히든 물고기 5종 발견',ok:s=>s.st.hidden>=5,g:8000,title:'히든 헌터'},
 {id:'a13',n:'바다 청소부',d:'잡동사니 10개 건지기',ok:s=>s.st.junk>=10,g:500},
 {id:'a14',n:'보스 사냥꾼',d:'보스 1마리 처치',ok:s=>bossWins()>=1,g:3000},
 {id:'a15',n:'보스 정복자',d:'보스 6종 모두 처치',ok:s=>bossWins()>=6,g:30000,title:'보스 정복자'},
 {id:'a16',n:'희귀 수집가',d:'희귀 이상 30종 모으기',ok:()=>FISH.filter(f=>f.r>=3&&save.dex[f.id]).length>=30,g:5000},
 {id:'a17',n:'민물 박사',d:'계곡·호수 친구 모두 모으기',ok:()=>FISH.filter(f=>!f.boss&&!f.hid&&f.r>0&&(f.loc.includes('valley')||f.loc.includes('lake'))).every(f=>save.dex[f.id]),g:5000},
 {id:'a18',n:'총 1톤',d:'누적 무게 1,000kg',ok:s=>s.st.totalKg>=1000,g:5000}];
const MT=[
 {t:'catch',f:n=>`물고기 ${n}마리 낚기`,n:[5,8,10],g:200},
 {t:'rare',f:n=>`희귀 이상 ${n}마리 낚기`,n:[1,2],g:400},
 {t:'perfect',f:n=>`퍼펙트 챔질 ${n}번`,n:[2,3,4],g:250},
 {t:'combo',f:n=>`${n}연속 성공하기`,n:[3,4],g:300},
 {t:'gold',f:n=>`골드 ${n} 벌기`,n:[500,1000],g:250},
 {t:'species',f:n=>`서로 다른 친구 ${n}종 낚기`,n:[3,4],g:300},
 {t:'heavy',f:()=>`1kg 넘는 물고기 낚기`,n:[1],g:300},
 {t:'crit',f:n=>`크리티컬 릴링 ${n}번`,n:[2,3],g:250},
 {t:'method',f:n=>`일반 낚시 말고 다른 방식으로 ${n}마리`,n:[3,5],g:300}];
const WT=[
 {t:'catch',f:n=>`이번 주 ${n}마리 낚기`,n:[40,60],g:1500},
 {t:'rare',f:n=>`희귀 이상 ${n}마리`,n:[8,12],g:2000},
 {t:'newsp',f:n=>`새 친구 ${n}종 도감 등록`,n:[3,5],g:2000},
 {t:'boss',f:()=>`보스 1번 처치`,n:[1],g:2500},
 {t:'locs',f:n=>`낚시터 ${n}곳에서 낚기`,n:[3,4],g:1500},
 {t:'heavykg',f:n=>`누적 ${n}kg 낚기`,n:[50,100],g:1800}];
const ATT=[{g:300},{gb:1},{g:500},{gb:2},{g:800},{gb:2,g:300},{g:1500,gb:3}];
const PH=[{n:'아침',ic:'🌅'},{n:'낮',ic:'☀️'},{n:'노을',ic:'🌇'},{n:'밤',ic:'🌙'}];
const PAL={
 sky:[{top:'#9fdcf7',bot:'#fdf3dc'},{top:'#4fb3e8',bot:'#c4ecff'},{top:'#ff8a5b',bot:'#ffd27a'},{top:'#0b1840',bot:'#2b3f78'}],
 sea:[['#2fa3bd','#0b4f6c'],['#1f8fb0','#0a3f60'],['#4a7aa0','#1b2f52'],['#123a62','#04142a']],
 fresh:[['#4fb39a','#0f4a3a'],['#3aa88a','#0c3f32'],['#6a8a7a','#1f3a3a'],['#1a3a3a','#04141a']],
 reef:[['#3fe0d8','#0b7a9a'],['#2fd0e0','#0a6a8a'],['#5aa0b8','#1b3a62'],['#155a7a','#04182a']],
 ice:[['#8fd0e4','#1f5f7a'],['#7fc4d8','#1f4f6a'],['#8a9ac0','#2a3a5a'],['#2a4a6a','#081a2a']],
 deep:[['#1a4a7a','#000814'],['#1a4a7a','#000814'],['#1a3a6a','#000814'],['#0a2a4a','#000510']],
 moon:[['#2a3a7a','#0a0f30'],['#2a3a7a','#0a0f30'],['#2a3a7a','#0a0f30'],['#24307a','#060a28']]};
const DAY=480;
/* ===== 3.0 장비: 낚싯대·릴·낚싯줄 (능력치가 전투 공식에 직접 들어감) ===== */
const RODS=[
 {id:'r0',n:'대나무 낚싯대',r:1,price:0,dist:30,pow:100,stab:100,crit:0,big:0,rec:'망둥어·전어',rl:'선착장'},
 {id:'r1',n:'유리섬유 로드',r:1,price:1200,dist:38,pow:112,stab:108,crit:4,big:5,rec:'고등어·노래미',rl:'선착장·갯바위'},
 {id:'r2',n:'카본 로드',r:2,price:4000,dist:46,pow:126,stab:118,crit:8,big:12,rec:'감성돔·삼치',rl:'갯바위·방파제'},
 {id:'r3',n:'프로 카본 로드',r:3,price:12000,dist:55,pow:145,stab:130,crit:12,big:20,rec:'참돔·방어',rl:'방파제·먼바다'},
 {id:'r4',n:'티타늄 마스터',r:4,price:30000,dist:64,pow:165,stab:142,crit:18,big:30,rec:'참다랑어·귀상어',rl:'먼바다·산호초'},
 {id:'r5',n:'포세이돈의 삼지창',r:5,price:80000,dist:75,pow:190,stab:158,crit:26,big:45,rec:'청새치·보스',rl:'심해·달빛 바다'}];
const REELS=[
 {id:'e0',n:'기본 스피닝 릴',r:1,price:0,spd:1.0,eff:30,tred:0,fat:0,crx:0},
 {id:'e1',n:'알루미늄 릴',r:1,price:1000,spd:1.2,eff:32,tred:6,fat:10,crx:5},
 {id:'e2',n:'베이트 릴',r:2,price:3500,spd:1.4,eff:34,tred:12,fat:18,crx:10},
 {id:'e3',n:'프로 스피닝 릴',r:3,price:10000,spd:1.65,eff:36,tred:18,fat:28,crx:15},
 {id:'e4',n:'파워 지깅 릴',r:4,price:26000,spd:1.9,eff:38,tred:24,fat:40,crx:22},
 {id:'e5',n:'포세이돈 릴',r:5,price:70000,spd:2.3,eff:42,tred:32,fat:60,crx:32}];
const LINES=[
 {id:'l0',n:'나일론 줄',r:1,price:0,max:8,grace:.3,sres:0,rec:55,big:0},
 {id:'l1',n:'카본 줄',r:1,price:900,max:12,grace:.42,sres:10,rec:60,big:5},
 {id:'l2',n:'PE 합사',r:2,price:3000,max:17,grace:.55,sres:18,rec:66,big:10},
 {id:'l3',n:'강화 PE',r:3,price:9000,max:23,grace:.7,sres:26,rec:72,big:18},
 {id:'l4',n:'다이아몬드 라인',r:4,price:24000,max:32,grace:.9,sres:36,rec:82,big:28},
 {id:'l5',n:'전설의 실',r:5,price:60000,max:42,grace:1.1,sres:46,rec:92,big:40}];
const ENH_MAX=5,enhCost=(it,lv)=>Math.max(300,Math.round(it.price*.25*(lv+1)/10)*10||300*(lv+1));
// 미끼 개편(기존 보유는 유지)
BAITS.splice(0,BAITS.length,
 {id:'worm',n:'일반 미끼(지렁이)',ic:'🪱',price:0,d:'다양한 어종이 고루 나와요 (흔한 친구 쏠림 ↓)'},
 {id:'shrimpb',n:'새우 미끼',ic:'🦐',price:600,d:'돔 종류·바닥 어종 2.2배'},
 {id:'squidb',n:'오징어 미끼',ic:'🦑',price:2200,d:'대형 포식어(희귀 이상 사냥꾼) 2.5배 · 큰 개체 ↑'},
 {id:'lure',n:'반짝이 루어',ic:'✨',price:2500,d:'빠른 어종(지그재그·돌진·점프) 2.5배'},
 {id:'deepb',n:'심해 미끼',ic:'🌌',price:5000,d:'심해 전용 어종 4배 · 수심 조건 100m 완화'},
 {id:'krill',n:'크릴 밑밥',ic:'🍤',price:1500,d:'입질이 30% 빨라짐 · 고급·희귀 ↑'},
 {id:'egi',n:'에기',ic:'🎣',price:2000,d:'문어·오징어류 3.5배'},
 {id:'paste',n:'떡밥',ic:'🍙',price:900,d:'민물 붕어·잉어류 2.5배'},
 {id:'goldb',n:'전설 미끼',ic:'🌟',price:400,cons:1,d:'1회용 · 영웅 이상 3배, 히든·변종 2배, 초대형 2배'});
// 수족관
const AQ_THEMES=[{id:'blue',n:'맑은 바다',price:0,top:'#7fd8f0',bot:'#1a6a9a'},{id:'coral',n:'산호 정원',price:3000,top:'#7ff0e0',bot:'#1a8aa0'},{id:'cave',n:'심해 동굴',price:6000,top:'#2a4a7a',bot:'#050a20'},{id:'moon',n:'달빛 수조',price:12000,top:'#4a3a9a',bot:'#0a0a30'}];
const AQ_DECOS=[{id:'plant',n:'수초 숲',ic:'🌿',price:600},{id:'bubbler',n:'거품 발생기',ic:'🫧',price:700},{id:'coral',n:'산호 무리',ic:'🪸',price:900},{id:'castle',n:'모래성',ic:'🏰',price:800},{id:'chest',n:'보물상자',ic:'💰',price:1200},{id:'ship',n:'난파선',ic:'⛵',price:2500}];
const AQ_CAP=[6,10,15,20],AQ_CAPP=[0,3000,10000,25000],AQ_FULL=[1000,3000,8000,20000];
const HIDTITLE={moonjelly:'달빛을 본 자',rainbow:'무지개를 낚은 자',deepeye:'심연과 눈 맞춘 자',fairy:'눈의 요정 친구',meteorf:'소원을 이룬 자',goldcarp:'황금 손 낚시꾼',ghost:'유령 사냥꾼',thunder:'번개를 잡은 자'};
const COMBO_T=[[3,'좋아!','#9ccc65'],[5,'대단해!','#4fc3f7'],[8,'최고야!','#a57fe0'],[12,'전설의 손맛!','#ffc531'],[20,'바다의 신!','#ff5fae']];
const TITLE_SHOP=[{n:'초보 강태공',price:500},{n:'여수 바다 사나이',price:3000},{n:'손맛 장인',price:8000},{n:'황금 낚시꾼',price:25000},{n:'살아있는 전설',price:100000}];
