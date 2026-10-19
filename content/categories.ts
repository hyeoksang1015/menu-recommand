import type { Locale } from "@/i18n/config";

// 메뉴 백과 카테고리 페이지의 소개 글과 고르는 팁. 운영자가 직접 쓴 글이다(한국어 원본 + 번역).
export interface CategoryText {
  intro: string[];
  tips: string[];
}

export const CATEGORY_TEXT: Record<string, Record<Locale, CategoryText>> = {
  korean: {
    ko: {
      intro: [
        "한식은 밥과 국(찌개), 반찬이 한 상에 나오는 구성이 기본이에요. 김치찌개·된장찌개처럼 뜨끈한 국물 요리, 비빔밥처럼 한 그릇으로 끝나는 밥 요리, 냉면·콩국수 같은 여름 별미까지 폭이 넓어서 어떤 상태에도 고를 메뉴가 있어요.",
        "발효 장(된장·고추장·간장)과 김치가 맛의 중심이라 같은 찌개라도 가게마다 맛이 꽤 달라요. 반찬이 함께 나오는 경우가 많아 가격 대비 든든하게 먹기 좋아요.",
      ],
      tips: [
        "몸이 으슬으슬하거나 피곤한 날엔 국밥·설렁탕·갈비탕처럼 맑고 뜨끈한 국물이 부담이 적어요.",
        "더운 날엔 물냉면·콩국수처럼 차가운 면이 좋아요. 비빔냉면은 맵기가 있으니 매운 걸 못 먹으면 물냉면을 고르세요.",
        "된장·고추장·간장에는 대두가, 국간장과 양념에는 밀이 들어가는 경우가 많아요. 콩·밀 알레르기가 있다면 꼭 물어보세요.",
      ],
    },
    en: {
      intro: [
        "A Korean meal is typically rice, a soup or stew and several side dishes served together. From hot stews like kimchi jjigae and doenjang jjigae, to one-bowl rice dishes like bibimbap, to summer favorites like cold naengmyeon and kongguksu, there's something for every mood.",
        "Fermented pastes (doenjang, gochujang, soy sauce) and kimchi are at the heart of the flavor, so the same stew can taste quite different from place to place. Side dishes usually come included, which makes Korean meals filling for the price.",
      ],
      tips: [
        "On a chilly or tiring day, clear hot soups such as gukbap, seolleongtang or galbitang are easy on the stomach.",
        "On hot days, cold noodles like mul naengmyeon or kongguksu are refreshing. Bibim naengmyeon is spicy, so choose mul naengmyeon if you avoid heat.",
        "Doenjang, gochujang and soy sauce contain soy, and many sauces contain wheat. If you have soy or wheat allergies, always ask.",
      ],
    },
    ja: {
      intro: [
        "韓国料理は、ご飯とスープ（チゲ）、おかずが一緒に出るのが基本です。キムチチゲやテンジャンチゲのような熱いスープ料理、ビビンバのような一皿で完結するご飯料理、冷麺やコングクスのような夏の名物まで幅広く、どんな状態でも選べるメニューがあります。",
        "発酵調味料（テンジャン・コチュジャン・醤油）とキムチが味の中心なので、同じチゲでも店ごとに味がかなり違います。おかずが付くことが多く、価格の割にしっかり食べられます。",
      ],
      tips: [
        "寒気がしたり疲れている日は、クッパ・ソルロンタン・カルビタンのような澄んだ温かいスープが負担が少なくおすすめです。",
        "暑い日は水冷麺やコングクスのような冷たい麺が合います。ビビン冷麺は辛いので、辛いものが苦手なら水冷麺を選びましょう。",
        "テンジャン・コチュジャン・醤油には大豆が、たれには小麦が入ることが多いです。大豆・小麦アレルギーがある方は必ず確認してください。",
      ],
    },
    zh: {
      intro: [
        "韩餐的基本形式是米饭、汤（炖锅）和小菜一起上桌。从泡菜汤、大酱汤这类热汤，到拌饭这样一碗搞定的饭菜，再到冷面、豆浆面等夏季风味，选择很多，无论什么状态都能找到合适的菜。",
        "发酵酱料（大酱、辣椒酱、酱油）和泡菜是味道的核心，所以同一道汤在不同店里味道差别不小。通常附带小菜，性价比高、容易吃饱。",
      ],
      tips: [
        "觉得发冷或疲惫时，汤饭、雪浓汤、排骨汤这类清淡的热汤对肠胃负担小。",
        "天热时适合水冷面、豆浆面等凉面。拌冷面偏辣，不能吃辣就选水冷面。",
        "大酱、辣椒酱和酱油含大豆，很多调味料含小麦。对大豆或小麦过敏的人请务必询问。",
      ],
    },
  },
  chinese: {
    ko: {
      intro: [
        "여기서 중식은 주로 한국식 중화요리를 말해요. 짜장면·짬뽕·탕수육처럼 한국에서 독자적으로 발전한 메뉴가 중심이고, 마라탕·샤오롱바오·꿔바로우처럼 중국 현지 스타일 메뉴도 함께 담았어요.",
        "배달과 1인 메뉴가 잘 갖춰져 있어 혼자서도 고르기 쉽고, 여럿이면 요리 하나에 식사 메뉴를 나눠 먹기 좋아요.",
      ],
      tips: [
        "짜장 계열은 맵지 않고 든든해요. 짬뽕 계열은 대부분 맵고 해산물(새우·조개·오징어)이 들어가요.",
        "튀김 요리(탕수육·깐풍기·유린기)는 기름진 편이라 느끼한 게 싫은 날엔 볶음밥이나 우육면이 나아요.",
        "마라 메뉴는 맵기를 고를 수 있는 가게가 많고, 땅콩 소스가 들어가는 경우가 있어요.",
      ],
    },
    en: {
      intro: [
        "Chinese food here mostly means Korean-Chinese cuisine. It centers on dishes that evolved uniquely in Korea, such as jjajangmyeon, jjamppong and tangsuyuk, alongside more mainland-style dishes like malatang, xiaolongbao and guobaorou.",
        "These restaurants are great at delivery and single portions, so they're easy for solo meals. In a group, you can share one main dish plus a meal each.",
      ],
      tips: [
        "Jjajang (black bean) dishes are mild and filling. Jjamppong dishes are mostly spicy and contain seafood such as shrimp, clams and squid.",
        "Fried dishes (tangsuyuk, kkanpunggi, yuringi) are on the greasy side. On a day you want something lighter, try fried rice or beef noodle soup.",
        "Many mala restaurants let you choose the spice level, and some sauces contain peanuts.",
      ],
    },
    ja: {
      intro: [
        "ここでの中華は主に韓国式中華料理を指します。チャジャン麺・チャンポン・タンスユクのように韓国で独自に発展したメニューが中心で、麻辣燙・小籠包・鍋包肉のような中国本場スタイルのメニューも含めました。",
        "デリバリーや1人前メニューが充実しているので一人でも選びやすく、大人数なら料理を一品取り分けて食事メニューと合わせるのがおすすめです。",
      ],
      tips: [
        "チャジャン系は辛くなくボリュームがあります。チャンポン系はほとんどが辛く、海鮮（エビ・貝・イカ）が入ります。",
        "揚げ物（タンスユク・カンプンギ・油淋鶏）は脂っこいので、さっぱりしたい日はチャーハンや牛肉麺がおすすめです。",
        "麻辣系は辛さを選べる店が多く、ピーナッツソースが入ることがあります。",
      ],
    },
    zh: {
      intro: [
        "这里的中餐主要指韩式中华料理。以炸酱面、炒码面、糖醋肉等在韩国独立发展起来的菜为主，也收录了麻辣烫、小笼包、锅包肉等中国本地风格的菜。",
        "外卖和一人份菜单很完善，一个人也容易选；多人时可以点一道菜分享，再各点一份主食。",
      ],
      tips: [
        "炸酱类不辣又管饱；炒码面类大多偏辣，并含虾、贝类、鱿鱼等海鲜。",
        "油炸菜（糖醋肉、干烹鸡、油淋鸡）偏油腻，想吃清淡些时可以选炒饭或牛肉面。",
        "麻辣类很多店可以选辣度，有些酱料含花生。",
      ],
    },
  },
  japanese: {
    ko: {
      intro: [
        "일식은 덮밥(돈부리), 면(라멘·우동·소바), 초밥·회, 튀김과 카츠처럼 조리법이 뚜렷하게 나뉘어 있어서 원하는 식감으로 고르기 쉬워요.",
        "간장·미소·가쓰오부시 육수가 기본이라 전반적으로 맵지 않고, 같은 덮밥이라도 규동은 가볍게, 가츠동은 든든하게 먹을 수 있어요.",
      ],
      tips: [
        "맵지 않은 메뉴가 필요하면 일식이 가장 고르기 쉬워요. 자루소바·우동은 가볍고, 돈코츠라멘·카츠카레는 든든해요.",
        "초밥·회·카이센동은 차갑게 먹는 메뉴라 생선을 날로 못 먹으면 빼 두세요.",
        "육수에 가쓰오부시(생선)가 들어가는 경우가 많아서 생선 알레르기가 있다면 국물 요리도 확인해 보세요.",
      ],
    },
    en: {
      intro: [
        "Japanese food divides clearly by cooking style: rice bowls (donburi), noodles (ramen, udon, soba), sushi and sashimi, and fried dishes like tempura and katsu. That makes it easy to choose by the texture you're craving.",
        "Soy sauce, miso and bonito broth form the base, so most dishes aren't spicy. Even among rice bowls, gyudon is fairly light while katsudon is very filling.",
      ],
      tips: [
        "If you need something non-spicy, Japanese food is the easiest choice. Zaru soba and udon are light; tonkotsu ramen and katsu curry are hearty.",
        "Sushi, sashimi and kaisendon are served cold and raw. Leave them out if you don't eat raw fish.",
        "Many broths are made with bonito flakes (fish), so check soups too if you have a fish allergy.",
      ],
    },
    ja: {
      intro: [
        "和食は丼もの、麺（ラーメン・うどん・そば）、寿司・刺身、天ぷらやカツのように調理法がはっきり分かれているので、食べたい食感で選びやすいです。",
        "醤油・味噌・かつお出汁が基本なので全体的に辛くなく、同じ丼でも牛丼は軽め、カツ丼はがっつり食べられます。",
      ],
      tips: [
        "辛くないメニューが欲しいときは和食が一番選びやすいです。ざるそば・うどんは軽め、豚骨ラーメン・カツカレーはがっつりです。",
        "寿司・刺身・海鮮丼は冷たい生ものなので、生魚が苦手なら外しておきましょう。",
        "出汁にかつお節（魚）を使うことが多いので、魚アレルギーがある方は汁物も確認してください。",
      ],
    },
    zh: {
      intro: [
        "日料按做法分得很清楚：盖饭（丼）、面（拉面、乌冬、荞麦面）、寿司和刺身、天妇罗和炸猪排等，所以很容易按想要的口感来选。",
        "以酱油、味噌和鲣鱼高汤为基础，大多不辣。同样是盖饭，牛肉盖饭比较清淡，猪排盖饭则很管饱。",
      ],
      tips: [
        "需要不辣的菜时，日料最容易选。荞麦冷面、乌冬面清淡，豚骨拉面、猪排咖喱管饱。",
        "寿司、刺身、海鲜盖饭是生冷食物，不吃生鱼的话请先去掉。",
        "高汤常用鲣鱼片（鱼），对鱼过敏的人也请留意汤类。",
      ],
    },
  },
  western: {
    ko: {
      intro: [
        "양식에는 파스타·피자·리조또 같은 이탈리아 요리를 중심으로 스테이크, 샐러드, 브런치, 그리고 부리또·타코 같은 멕시코 음식까지 담았어요.",
        "크림·치즈·버터를 쓰는 메뉴가 많아 맛이 진하고, 분위기 있는 식사나 기념일에 고르기 좋아요. 반대로 샐러드·포케처럼 가볍게 먹을 수 있는 메뉴도 함께 있어요.",
      ],
      tips: [
        "크림·로제 파스타는 든든하지만 느끼할 수 있어요. 가볍게 먹고 싶다면 토마토·알리오올리오·봉골레가 나아요.",
        "샐러드와 포케는 차갑게 나오는 가벼운 메뉴라 다이어트 중이거나 더운 날에 잘 맞아요.",
        "대부분 밀과 우유가 들어가요. 밀이나 유제품을 피해야 한다면 스테이크나 빠에야처럼 면·빵이 없는 메뉴를 보세요.",
      ],
    },
    en: {
      intro: [
        "Western food centers on Italian dishes like pasta, pizza and risotto, plus steak, salads, brunch, and Mexican food such as burritos and tacos.",
        "Many dishes use cream, cheese and butter, so flavors are rich and they suit a special occasion. There are also light options like salads and poke bowls.",
      ],
      tips: [
        "Cream and rosé pastas are filling but can feel heavy. For something lighter, choose tomato, aglio e olio or vongole.",
        "Salads and poke bowls are served cold and light, good for a diet or a hot day.",
        "Most dishes contain wheat and milk. If you avoid them, look at dishes without pasta or bread, such as steak or paella.",
      ],
    },
    ja: {
      intro: [
        "洋食にはパスタ・ピザ・リゾットなどのイタリア料理を中心に、ステーキ、サラダ、ブランチ、そしてブリトーやタコスのようなメキシコ料理まで含めました。",
        "クリーム・チーズ・バターを使うメニューが多く味が濃厚で、雰囲気のある食事や記念日に選びやすいです。一方でサラダやポキボウルのように軽く食べられるメニューもあります。",
      ],
      tips: [
        "クリーム・ロゼパスタはボリュームがありますが重く感じることも。軽めならトマト・アーリオオーリオ・ボンゴレがおすすめです。",
        "サラダやポキボウルは冷たく軽いメニューなので、ダイエット中や暑い日に向いています。",
        "ほとんどに小麦と乳が入ります。避けたい場合はステーキやパエリアのように麺やパンのないメニューを見てください。",
      ],
    },
    zh: {
      intro: [
        "西餐以意面、披萨、意式烩饭等意大利菜为主，也包括牛排、沙拉、早午餐，以及墨西哥卷饼、塔可等墨西哥菜。",
        "很多菜使用奶油、奶酪和黄油，味道浓郁，适合有氛围的用餐或纪念日。也有沙拉、波奇饭这样清爽的选择。",
      ],
      tips: [
        "奶油和玫瑰酱意面很管饱，但可能偏腻。想吃清淡些可以选番茄、蒜香橄榄油或蛤蜊意面。",
        "沙拉和波奇饭是清凉的轻食，适合减肥期间或天热的时候。",
        "大多含小麦和牛奶。需要避开时，可以看看牛排、西班牙海鲜饭这类没有面和面包的菜。",
      ],
    },
  },
  snack: {
    ko: {
      intro: [
        "분식은 떡볶이·김밥·라면·순대·튀김처럼 분식집에서 파는 간단한 음식이에요. 값이 싸고 빨리 나와서 바쁜 점심이나 출출한 오후에 고르기 좋아요.",
        "떡볶이 하나만 해도 국물·짜장·로제·치즈처럼 종류가 다양하고, 김밥·튀김과 곁들여 여럿이 나눠 먹기에도 좋아요.",
      ],
      tips: [
        "예산이 적을 때 가장 고르기 쉬운 종류예요. 대부분 5천 원 안팎이에요.",
        "떡볶이·라볶이·쫄면은 대체로 매워요. 매운 게 싫다면 짜장떡볶이나 김밥, 어묵탕을 고르세요.",
        "떡과 면, 튀김옷에 밀이 들어가는 경우가 많아요. 쌀떡을 쓰는 가게도 있으니 밀 알레르기가 있다면 물어보세요.",
      ],
    },
    en: {
      intro: [
        "Bunsik means simple Korean snack-bar food such as tteokbokki, gimbap, ramyeon, sundae and twigim (fritters). It's cheap and fast, perfect for a busy lunch or an afternoon snack.",
        "Tteokbokki alone comes in many styles, from soupy to jjajang, rosé and cheese, and it's great for sharing with gimbap and fritters.",
      ],
      tips: [
        "This is the easiest category on a tight budget. Most dishes cost around ₩5,000.",
        "Tteokbokki, rabokki and jjolmyeon are usually spicy. If you avoid heat, choose jjajang tteokbokki, gimbap or fish cake soup.",
        "Rice cakes, noodles and batter often contain wheat. Some shops use rice-only cakes, so ask if you have a wheat allergy.",
      ],
    },
    ja: {
      intro: [
        "粉食（ブンシク）は、トッポッキ・キンパ・ラミョン・スンデ・天ぷらのように粉食店で売られている手軽な食べ物です。安くてすぐ出てくるので、忙しいランチや小腹が空いた午後にぴったりです。",
        "トッポッキだけでも汁だく・チャジャン・ロゼ・チーズなど種類が多く、キンパや天ぷらと一緒にみんなでシェアするのにも向いています。",
      ],
      tips: [
        "予算が少ないときに一番選びやすいジャンルです。ほとんどが5,000ウォン前後です。",
        "トッポッキ・ラッポッキ・チョルミョンはだいたい辛いです。辛いのが苦手ならチャジャントッポッキやキンパ、おでんを選びましょう。",
        "餅や麺、衣に小麦が入ることが多いです。米餅を使う店もあるので、小麦アレルギーがある方は確認してください。",
      ],
    },
    zh: {
      intro: [
        "韩式小吃（粉食）指辣炒年糕、紫菜包饭、拉面、米肠、炸物等小吃店里的简单食物。便宜又上得快，适合忙碌的午餐或下午垫肚子。",
        "光是炒年糕就有汤炒年糕、炸酱、玫瑰酱、芝士等多种口味，和紫菜包饭、炸物一起多人分享也很合适。",
      ],
      tips: [
        "预算少时最容易选的类别，大多在 5,000 韩元左右。",
        "炒年糕、拉面炒年糕、辣拌筋面一般都辣。不吃辣可以选炸酱炒年糕、紫菜包饭或鱼饼汤。",
        "年糕、面条和面衣常含小麦。也有店用纯米年糕，对小麦过敏请先询问。",
      ],
    },
  },
  asian: {
    ko: {
      intro: [
        "아시안에는 베트남(쌀국수·분짜·반미), 태국(팟타이·똠얌꿍·커리), 인도네시아·말레이시아(나시고렝·락사), 인도(커리·비리야니), 그리고 중동(케밥·팔라펠) 음식을 모았어요.",
        "허브와 향신료, 피시소스와 코코넛을 많이 써서 한식·일식과는 다른 새로운 맛을 원할 때 고르기 좋아요.",
      ],
      tips: [
        "쌀국수와 분짜는 국물이나 면이 가벼워 부담 없이 먹기 좋아요. 커리와 비리야니는 든든해요.",
        "똠얌꿍·쏨땀·그린커리는 꽤 매워요. 매운 게 싫다면 마싸만커리나 카오만까이를 보세요.",
        "피시소스(생선)와 새우 페이스트, 땅콩이 숨어 있는 경우가 많아요. 해당 알레르기가 있다면 꼭 확인하세요.",
      ],
    },
    en: {
      intro: [
        "Asian here gathers Vietnamese (pho, bun cha, banh mi), Thai (pad thai, tom yum, curries), Indonesian and Malaysian (nasi goreng, laksa), Indian (curry, biryani) and Middle Eastern (kebab, falafel) dishes.",
        "They use plenty of herbs, spices, fish sauce and coconut, so they're a great pick when you want flavors different from Korean or Japanese food.",
      ],
      tips: [
        "Pho and bun cha have light broth or noodles and are easy to eat. Curries and biryani are hearty.",
        "Tom yum, som tam and green curry are quite spicy. If you avoid heat, try massaman curry or khao man gai.",
        "Fish sauce, shrimp paste and peanuts are often hidden in these dishes. Check carefully if you have those allergies.",
      ],
    },
    ja: {
      intro: [
        "アジア料理には、ベトナム（フォー・ブンチャー・バインミー）、タイ（パッタイ・トムヤムクン・カレー）、インドネシア・マレーシア（ナシゴレン・ラクサ）、インド（カレー・ビリヤニ）、そして中東（ケバブ・ファラフェル）の料理を集めました。",
        "ハーブやスパイス、ナンプラーやココナッツをよく使うので、韓国料理や和食とは違う新しい味がほしいときにおすすめです。",
      ],
      tips: [
        "フォーやブンチャーはスープや麺が軽く、気軽に食べられます。カレーやビリヤニはボリュームがあります。",
        "トムヤムクン・ソムタム・グリーンカレーはかなり辛いです。辛いのが苦手ならマッサマンカレーやカオマンガイを。",
        "ナンプラー（魚）やエビペースト、ピーナッツが隠れていることが多いです。該当するアレルギーがある方は必ず確認してください。",
      ],
    },
    zh: {
      intro: [
        "亚洲菜汇集了越南（河粉、烤肉米线、法棍三明治）、泰国（泰式炒河粉、冬阴功、咖喱）、印尼和马来西亚（印尼炒饭、叻沙）、印度（咖喱、香饭）以及中东（土耳其烤肉、炸鹰嘴豆丸）的菜。",
        "大量使用香草、香料、鱼露和椰子，想吃与韩餐、日料不同的新口味时很合适。",
      ],
      tips: [
        "河粉和烤肉米线汤和面都清爽，吃起来没负担；咖喱和香饭很管饱。",
        "冬阴功、青木瓜沙拉和绿咖喱相当辣。不吃辣可以看看马萨曼咖喱或海南鸡饭。",
        "鱼露、虾酱和花生常常藏在菜里，有相关过敏请务必确认。",
      ],
    },
  },
  fastfood: {
    ko: {
      intro: [
        "패스트푸드에는 치킨, 버거, 피자처럼 빨리 나오고 배달하기 좋은 메뉴를 모았어요. 특히 한국식 치킨은 후라이드·양념·간장·파닭처럼 양념 종류가 다양한 게 특징이에요.",
        "여럿이 나눠 먹기 좋고 호불호가 적어서 모임 메뉴로 자주 고르게 돼요. 가격은 1인 기준으로 적었어요.",
      ],
      tips: [
        "대부분 튀기거나 치즈가 들어가 기름진 편이에요. 느끼한 게 싫다면 오븐구이 치킨이나 서브 샌드위치가 가벼워요.",
        "치킨은 양념에 따라 맵기가 크게 달라요. 매운 치킨·매운 닭날개는 맵기가 높아요.",
        "튀김옷과 빵에 밀이, 소스에 대두·우유가 들어가는 경우가 많아요.",
      ],
    },
    en: {
      intro: [
        "Fast food gathers quick, delivery-friendly dishes like fried chicken, burgers and pizza. Korean fried chicken in particular comes in many styles: plain fried, yangnyeom (sweet and spicy), soy garlic and padak with scallions.",
        "These dishes are easy to share and widely liked, which makes them a common choice for groups. Prices are listed per person.",
      ],
      tips: [
        "Most dishes are fried or cheesy and fairly greasy. For something lighter, try oven-roasted chicken or a submarine sandwich.",
        "Fried chicken spice levels vary a lot by sauce. Spicy fried chicken and spicy wings are hot.",
        "Batter and buns contain wheat, and sauces often contain soy or milk.",
      ],
    },
    ja: {
      intro: [
        "ファストフードには、チキン・バーガー・ピザのようにすぐ出てきてデリバリーしやすいメニューを集めました。特に韓国式チキンは、フライド・ヤンニョム・醤油・パダックのように味付けの種類が多いのが特徴です。",
        "みんなで分けやすく好き嫌いが少ないので、集まりのメニューとしてよく選ばれます。価格は1人前で記載しています。",
      ],
      tips: [
        "ほとんどが揚げ物やチーズ入りで脂っこめです。さっぱりしたいならオーブンチキンやサブサンドが軽めです。",
        "チキンは味付けによって辛さが大きく変わります。激辛チキンや辛口手羽先はかなり辛いです。",
        "衣やパンに小麦が、ソースに大豆や乳が入ることが多いです。",
      ],
    },
    zh: {
      intro: [
        "快餐汇集了炸鸡、汉堡、披萨等上菜快、适合外卖的菜。尤其是韩式炸鸡，有原味、甜辣、酱油、葱丝等多种口味。",
        "适合多人分享，接受度高，常被选为聚会菜单。价格按人均标注。",
      ],
      tips: [
        "大多是油炸或带奶酪的，偏油腻。想清淡些可以选烤鸡或潜艇三明治。",
        "炸鸡的辣度因酱料差别很大，香辣炸鸡和香辣鸡翅都很辣。",
        "面衣和面包含小麦，酱料常含大豆或牛奶。",
      ],
    },
  },
  grill: {
    ko: {
      intro: [
        "고기·구이에는 삼겹살·목살·갈비 같은 한국식 고기구이와 곱창·막창, 닭갈비, 장어·조개구이, 그리고 바비큐 립과 브리스킷을 담았어요.",
        "테이블에서 직접 구워 먹는 메뉴가 많아 여럿이 함께하는 저녁이나 회식에 잘 어울려요. 1인분 가격으로 적었지만 보통 2인분 이상 주문해요.",
      ],
      tips: [
        "든든하게 먹고 싶을 때 가장 확실한 종류예요. 다만 기름진 부위(삼겹살·항정살·곱창)가 많아요.",
        "덜 기름진 걸 원한다면 목살, 닭구이, 조개구이, 연어 스테이크를 보세요.",
        "양념구이(갈비·불고기)에는 간장(대두·밀)이 들어가요. 소금구이는 재료 자체만 확인하면 돼요.",
      ],
    },
    en: {
      intro: [
        "BBQ & Grill covers Korean barbecue such as pork belly, pork neck and galbi, plus gopchang and makchang (intestines), dakgalbi, grilled eel and clams, and American-style ribs and brisket.",
        "Many of these are grilled at the table, which suits group dinners and company get-togethers. Prices are listed per serving, but most places expect at least two servings per order.",
      ],
      tips: [
        "This is the surest choice when you want something filling, though many cuts are fatty (pork belly, pork jowl, gopchang).",
        "For something less greasy, look at grilled pork neck, grilled chicken, grilled clams or salmon steak.",
        "Marinated meats (galbi, bulgogi) use soy sauce, which contains soy and wheat. Salt-grilled meats only contain the meat itself.",
      ],
    },
    ja: {
      intro: [
        "焼肉・グリルには、サムギョプサル・豚肩ロース・カルビなどの韓国式焼肉、コプチャン・マクチャン、タッカルビ、うなぎや貝の焼き物、そしてBBQリブやブリスケットを含めました。",
        "テーブルで焼いて食べるメニューが多く、大人数の夕食や飲み会によく合います。1人前の価格で記載していますが、普通は2人前以上から注文します。",
      ],
      tips: [
        "がっつり食べたいときに一番確実なジャンルです。ただし脂の多い部位（サムギョプサル・豚トロ・コプチャン）が多いです。",
        "脂っこくないものがよければ、豚肩ロース、鶏の炭火焼き、焼き貝、サーモンステーキを見てください。",
        "味付け焼き（カルビ・プルコギ）には醤油（大豆・小麦）が入ります。塩焼きは素材そのものだけ確認すれば大丈夫です。",
      ],
    },
    zh: {
      intro: [
        "烤肉类包括五花肉、猪颈肉、排骨等韩式烤肉，烤牛小肠和猪大肠、辣炒鸡排、烤鳗鱼和烤贝类，还有烧烤肋排和烟熏牛胸肉。",
        "很多是在餐桌上自己烤，适合多人晚餐或聚餐。价格按一人份标注，但通常至少点两人份。",
      ],
      tips: [
        "想吃得饱饱的，这是最稳妥的类别，不过油脂多的部位（五花肉、猪颊肉、牛小肠）不少。",
        "想吃得不那么油腻，可以看看猪颈肉、烤鸡肉、烤贝类或三文鱼排。",
        "调味烤肉（排骨、烤肉）用酱油，含大豆和小麦；盐烤只需确认食材本身即可。",
      ],
    },
  },
};
