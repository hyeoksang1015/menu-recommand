import type { Locale } from "@/i18n/config";

// 소개·개인정보처리방침·문의·메뉴 백과·사진 출처 페이지의 글. 서버에서만 읽는다.
// 한국어가 원본이고 다른 언어는 번역이다.

interface Section {
  heading: string;
  body: string[];
}
interface Faq {
  q: string;
  a: string;
}
export interface PageText {
  about: {
    title: string;
    description: string;
    intro: string[];
    sections: Section[];
    faqTitle: string;
    faq: Faq[];
  };
  privacy: {
    title: string;
    description: string;
    updated: string;
    sections: Section[];
  };
  contact: {
    title: string;
    description: string;
    body: string[];
    emailLabel: string;
  };
  menus: {
    title: string;
    description: string;
    intro: string;
    metaTitle: string;
    count: string;
    categoryTitle: string;
    categoryHeading: string;
    categoryFacts: string;
    categoryDescription: string;
    tipsTitle: string;
    listTitle: string;
    allergens: string;
    noAllergens: string;
    photoBy: string;
    back: string;
    others: string;
  };
  guides: {
    title: string;
    description: string;
    intro: string;
    back: string;
    related: string;
  };
  credits: {
    title: string;
    description: string;
    intro: string;
    noPhoto: string;
    source: string;
  };
  notFound: { title: string; body: string; home: string };
}

const ko: PageText = {
  about: {
    title: "골라주께 소개",
    description:
      "골라주께가 메뉴 고민 시간을 줄이는 방법, 3개를 고르는 기준, 거절에서 배우는 방식, 데이터와 사진의 출처를 설명합니다.",
    intro: [
      '골라주께는 "오늘 뭐 먹지?"에 쓰는 시간을 줄이려고 만들었어요. 배달 앱을 한참 내리다가, 단톡방에 "아무거나"만 오가다가 점심시간 절반이 지나간 적 있다면 바로 그 시간을 아껴 드리려는 거예요.',
      "고를 게 많으면 오히려 더 못 고르게 돼요. 그래서 메뉴 250개 중 못 먹는 것과 오늘 안 끌리는 걸 먼저 걸러 내고, 서로 다른 종류에서 딱 3개만 남겨요. 카드마다 왜 그 메뉴인지 적어 두니까 다시 따져 볼 필요 없이 하나만 고르면 돼요. 룰렛처럼 아무거나 뽑지 않고 마지막 선택을 직접 하게 둔 것도, 그래야 고른 뒤에 다시 흔들리지 않기 때문이에요.",
    ],
    sections: [
      {
        heading: "빼주께와 맞춰주께",
        body: [
          "빼주께에서는 못 먹는 재료(우유, 달걀, 밀, 갑각류 등 11가지), 오늘은 피하고 싶은 종류, 어제 먹은 메뉴를 먼저 빼요. 여기서 뺀 메뉴는 어떤 경우에도 추천되지 않아요.",
          '맞춰주께에서는 배고픈 정도, 기분, 계절, 끌리는 조리방식(탕·국, 찌개·전골, 볶음, 찜·조림 등), 같이 먹는 사람, 1인 예산을 골라요. 모든 질문에 "상관없어"가 있으니 모르는 건 넘어가도 돼요. 고르는 동안 화면 아래에 남은 후보 수가 바로 보여요.',
        ],
      },
      {
        heading: "3개는 이렇게 달라요",
        body: [
          "무난한 선택은 오늘 상태와 지금까지 쌓인 취향에 가장 잘 맞는 메뉴예요. 오늘 상태에 딱은 취향은 빼고 지금 상태(얼마나 든든하게, 따뜻하게 먹고 싶은지)만 본 메뉴예요. 새로운 도전은 아직 덜 추천받은 메뉴 중에서 고른 메뉴예요.",
          "세 메뉴는 항상 서로 다른 종류(한식, 중식, 일식 등)에서 나와요. 비슷한 메뉴 셋 중에서 고르느라 다시 고민하지 않도록요. 카드에는 고른 이유도 적어 두는데, 입력한 조건 중 실제로 맞아떨어진 것만 적어요.",
        ],
      },
      {
        heading: "거절하면 배워요",
        body: [
          '"다른 거"를 누르고 이유를 고르면 바로 다시 골라요. 어제 먹었다고 하면 이틀 동안 그 메뉴를 빼고, 느끼하다고 하면 그보다 덜 기름진 메뉴로, 비싸다고 하면 그보다 싼 메뉴로 다시 찾아요. 그냥 싫다고 하면 그 종류의 점수를 조금 낮춰 다음 추천에도 반영해요.',
        ],
      },
      {
        heading: "데이터와 사진",
        body: [
          "메뉴 250개의 가격, 맵기, 든든함, 기름진 정도, 들어가는 재료는 운영자가 일반적인 조리법과 국내 식당 가격을 참고해 직접 정리했어요. 가격은 1인 기준 대략적인 값이고 지역과 가게마다 달라요.",
          "음식 사진은 Wikimedia Commons에 자유 라이선스(CC0, CC BY, CC BY-SA 등)로 공개된 사진이에요. 작가와 라이선스는 사진 출처 페이지에서 메뉴별로 확인할 수 있어요.",
        ],
      },
    ],
    faqTitle: "자주 묻는 질문",
    faq: [
      {
        q: "알레르기 정보는 믿어도 되나요?",
        a: "일반적인 조리법 기준의 참고 정보예요. 같은 메뉴라도 가게마다 재료가 달라요. 알레르기가 있다면 꼭 식당에 직접 확인해 주세요.",
      },
      {
        q: "내 취향과 기록은 어디에 저장되나요?",
        a: "이 브라우저의 저장소(localStorage)에만 저장돼요. 서버로 보내지 않으며, 브라우저 데이터를 지우면 함께 지워져요.",
      },
      {
        q: "같은 메뉴가 계속 나와요.",
        a: '"다른 거"를 누르고 이유를 골라 주세요. 이유에 맞춰 조건이 바뀌고, 새로운 도전 칸은 자주 본 메뉴일수록 덜 나오게 계산돼요.',
      },
      {
        q: "외국에서도 쓸 수 있나요?",
        a: "네. 영어, 일본어, 중국어로도 볼 수 있어요. 다만 가격은 한국 식당 기준이고, 한국어 화면의 근처 찾기는 카카오맵, 다른 언어는 Google 지도로 연결돼요.",
      },
    ],
  },
  privacy: {
    title: "개인정보처리방침",
    description:
      "골라주께가 어떤 정보를 어디에 저장하고, 광고 쿠키를 어떻게 쓰는지 설명합니다.",
    updated: "시행일: 2026년 10월 19일",
    sections: [
      {
        heading: "1. 수집하는 정보",
        body: [
          "골라주께는 회원가입이 없고, 이름·전화번호·이메일 같은 개인정보를 받지 않아요. 운영자가 관리하는 서버나 데이터베이스도 없어요.",
        ],
      },
      {
        heading: "2. 기기에 저장되는 정보",
        body: [
          "추천을 위해 입력한 조건, 거절로 학습한 종류별 선호, 메뉴별로 추천된 횟수, 먹은 기록(메뉴와 날짜), 사용 방법 안내를 봤는지 여부를 이 브라우저의 localStorage에 저장해요. 이 정보는 기기 밖으로 보내지 않으며, 브라우저 설정에서 사이트 데이터를 지우면 바로 삭제돼요.",
        ],
      },
      {
        heading: "3. 광고, 방문 통계와 쿠키",
        body: [
          "이 사이트는 Google 애드센스를 통해 광고를 게재할 수 있어요. Google을 포함한 제3자 공급업체는 쿠키를 사용해 사용자가 이 사이트나 다른 사이트를 방문한 기록을 바탕으로 광고를 게재해요.",
          "Google은 광고 쿠키를 사용해 사용자가 이 사이트와 인터넷의 다른 사이트를 방문한 기록에 기반한 광고를 보여 줄 수 있어요. 맞춤 광고는 Google 광고 설정(https://adssettings.google.com)에서 끌 수 있고, www.aboutads.info에서 다른 제3자 공급업체의 맞춤 광고 쿠키도 끌 수 있어요.",
          "Google이 파트너 사이트의 데이터를 어떻게 사용하는지는 https://policies.google.com/technologies/partner-sites 에서 확인할 수 있어요.",
          "이용 현황을 파악하려고 모든 페이지에서 Google 애널리틱스를 사용해요. 방문한 페이지, 머문 시간, 대략적인 지역, 기기·브라우저 정보 등이 Google에 전달되고, 이를 위해 Google 애널리틱스 쿠키(_ga 등)가 저장될 수 있어요. 기기에 저장된 입력 조건과 먹은 기록은 보내지 않아요. 수집을 원하지 않으면 Google 애널리틱스 차단 브라우저 부가기능(https://tools.google.com/dlpage/gaoptout)을 쓰거나 브라우저에서 쿠키를 차단할 수 있어요.",
        ],
      },
      {
        heading: "4. 외부 링크",
        body: [
          "근처 찾기 버튼은 카카오맵이나 Google 지도 검색 결과로 연결돼요. 이때 메뉴 이름이 검색어로 전달되며, 그 이후는 각 서비스의 개인정보처리방침을 따라요.",
        ],
      },
      {
        heading: "5. 문의",
        body: ["개인정보와 관련한 문의는 아래 이메일로 보내 주세요."],
      },
    ],
  },
  contact: {
    title: "문의",
    description:
      "골라주께에 대한 의견, 메뉴 정보 오류 제보, 사진 관련 문의를 받습니다.",
    body: [
      "메뉴 정보(가격, 재료, 맵기)가 실제와 많이 다르거나, 추가했으면 하는 메뉴가 있다면 알려 주세요. 사진의 저작권과 관련한 요청도 이메일로 받아요.",
      "보통 3영업일 안에 답장을 드려요.",
    ],
    emailLabel: "이메일",
  },
  menus: {
    title: "메뉴 백과",
    description:
      "한식, 중식, 일식, 양식, 분식, 아시안, 패스트푸드, 고기·구이 8가지 종류의 메뉴 250개를 사진과 함께 정리했습니다.",
    intro:
      "골라주께가 추천하는 메뉴 250개를 8가지 종류로 나눠 정리했어요. 종류마다 특징과 고를 때 도움이 되는 팁, 메뉴별 대략적인 가격과 맵기, 들어가는 주요 재료를 볼 수 있어요.",
    metaTitle: "메뉴 백과: 8가지 종류 메뉴 250개 가격·맵기·재료",
    count: "메뉴 {count}개",
    categoryTitle: "{name} 메뉴 {count}가지: 가격·맵기·재료 한눈에",
    categoryHeading: "{name} 메뉴 {count}가지",
    categoryFacts:
      "1인 약 {min}~{max} · 안 매운 메뉴 {mild}개 · 따뜻하게 먹는 메뉴 {hot}개",
    categoryDescription:
      "{name} 메뉴 {count}개를 사진과 함께 정리했어요. 1인 약 {min}~{max}, 안 매운 메뉴는 {mild}개예요. 종류별 특징과 고르는 팁, 메뉴마다 맵기와 주요 재료도 볼 수 있어요.",
    tipsTitle: "고를 때 팁",
    listTitle: "메뉴 목록",
    allergens: "주요 재료",
    noAllergens: "표시할 주요 알레르기 재료 없음",
    photoBy: "사진",
    back: "메뉴 백과로",
    others: "다른 종류 메뉴 백과",
  },
  guides: {
    title: "메뉴 고르기 가이드",
    description:
      "점심 메뉴를 빨리 정하는 법부터 기분·날씨별, 인원별, 알레르기가 있을 때 메뉴 고르는 법까지 정리했습니다.",
    intro:
      "메뉴를 고르는 일이 매번 피곤하다면, 기준 몇 가지만 정해 두어도 훨씬 쉬워져요. 상황별로 도움이 되는 방법을 정리했어요.",
    back: "가이드 목록",
    related: "다른 가이드",
  },
  credits: {
    title: "사진 출처",
    description:
      "골라주께에 쓰인 음식 사진의 작가와 라이선스를 메뉴별로 밝힙니다.",
    intro:
      "골라주께의 음식 사진은 모두 Wikimedia Commons에서 자유 라이선스로 공개된 사진이에요. 화면에 맞게 4:3으로 자르고 크기를 줄였어요. 작가, 라이선스, 원본 페이지는 아래와 같아요. 사진이 없는 메뉴는 알맞은 자유 라이선스 사진을 찾지 못한 메뉴예요.",
    noPhoto: "사진 없음",
    source: "원본",
  },
  notFound: {
    title: "페이지를 찾을 수 없어요",
    body: "주소가 바뀌었거나 없는 페이지예요. 아래에서 다시 시작해 보세요.",
    home: "메뉴 고르러 가기",
  },
};

const en: PageText = {
  about: {
    title: "About Gollajuke",
    description:
      "How Gollajuke cuts down the time you spend deciding, how it picks three dishes, how it learns from your rejections, and where the data and photos come from.",
    intro: [
      'Gollajuke (Korean for "I\'ll pick for you") exists to cut down the time you spend on "what should we eat?". If you\'ve ever scrolled a delivery app for ages, or watched a group chat go nowhere with "anything is fine" until half your lunch break was gone, that\'s the time we want to give back.',
      "The more options you have, the harder it gets to choose. So we first filter 250 dishes down to what you can eat and what suits today, then keep just three from different cuisines. Each card says why that dish made the cut, so you don't have to weigh it all again. We still leave the final call to you instead of spinning a roulette, because a choice you made yourself is one you're less likely to second-guess.",
      "There is no sign-up and no server. All recommendations are calculated on your own device, and your preferences and meal history stay in this browser.",
    ],
    sections: [
      {
        heading: "Leave out and Match me",
        body: [
          "Under Leave out, you first remove ingredients you can't eat (11 groups such as milk, egg, wheat and shellfish), cuisines you want to skip today, and what you ate yesterday. Anything removed here is never recommended.",
          "Under Match me, you choose your hunger, mood, the season, the cooking styles you feel like (soups, stews, stir-fries, braised dishes and more), company and budget per person. Every question has an Any option, so you can skip what you're unsure about. The number of matching dishes updates at the bottom of the screen as you go.",
        ],
      },
      {
        heading: "How the three picks differ",
        body: [
          "The Safe choice best fits both how you feel today and the preferences you've built up. Fits your mood ignores preferences and looks only at your current state, such as how filling or how warm you want your meal. Try something new comes from dishes you've seen less often.",
          "The three picks always come from different cuisines, so you don't end up agonizing over three similar dishes. Each card also says why we picked it, using only the choices of yours that actually matched.",
        ],
      },
      {
        heading: "It learns when you say no",
        body: [
          "Tap Something else and choose a reason to get a new pick immediately. Had it yesterday removes the dish for two days, Too greasy looks for something lighter, and Too pricey looks for something cheaper. Just not feeling it slightly lowers that cuisine's score for future picks too.",
        ],
      },
      {
        heading: "Data and photos",
        body: [
          "The prices, spiciness, heartiness, greasiness and main ingredients of all 250 dishes were compiled by the site operator from typical recipes and restaurant prices in Korea. Prices are rough per-person amounts and vary by area and restaurant.",
          "Food photos are freely licensed images (CC0, CC BY, CC BY-SA and others) from Wikimedia Commons. You can find the author and license of each photo on the Photo credits page.",
        ],
      },
    ],
    faqTitle: "FAQ",
    faq: [
      {
        q: "Can I rely on the allergen information?",
        a: "It is reference information based on typical recipes. The same dish can be made differently at each restaurant, so if you have allergies, always check with the restaurant.",
      },
      {
        q: "Where are my preferences and history stored?",
        a: "Only in this browser's storage (localStorage). Nothing is sent to a server, and clearing your browser data deletes it.",
      },
      {
        q: "I keep seeing the same dish.",
        a: "Tap Something else and choose a reason. Your conditions change accordingly, and the Try something new slot favors dishes you've seen less.",
      },
      {
        q: "Can I use it outside Korea?",
        a: "Yes. The site is available in English, Japanese and Chinese. Prices are based on restaurants in Korea, and Find nearby opens Google Maps in languages other than Korean.",
      },
    ],
  },
  privacy: {
    title: "Privacy policy",
    description:
      "What Gollajuke stores, where it is stored, and how advertising cookies are used.",
    updated: "Effective date: October 19, 2026",
    sections: [
      {
        heading: "1. Information we collect",
        body: [
          "Gollajuke has no accounts and does not ask for personal information such as your name, phone number or email address. The operator runs no server or database.",
        ],
      },
      {
        heading: "2. Information stored on your device",
        body: [
          "To make recommendations, this site stores the conditions you entered, cuisine preferences learned from your rejections, how often each dish was shown, your meal history (dish and date), and whether you have seen the how-to guide in this browser's localStorage. This data never leaves your device and is deleted when you clear site data in your browser settings.",
        ],
      },
      {
        heading: "3. Advertising, analytics and cookies",
        body: [
          "This site may show ads through Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.",
          "Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this site and other sites on the internet. You can opt out of personalized advertising in Google Ads Settings (https://adssettings.google.com), and opt out of other third-party vendors' cookies at www.aboutads.info.",
          "Learn how Google uses data from partner sites at https://policies.google.com/technologies/partner-sites.",
          "To understand how the site is used, every page uses Google Analytics. Pages visited, time spent, approximate location, and device and browser information are sent to Google, and Google Analytics cookies (such as _ga) may be stored for this. The conditions and meal history saved on your device are not sent. To opt out, use the Google Analytics Opt-out Browser Add-on (https://tools.google.com/dlpage/gaoptout) or block cookies in your browser.",
        ],
      },
      {
        heading: "4. External links",
        body: [
          "The Find nearby button opens Kakao Map or Google Maps search results, passing the dish name as the search term. From then on, that service's privacy policy applies.",
        ],
      },
      {
        heading: "5. Contact",
        body: ["For privacy questions, please email us at the address below."],
      },
    ],
  },
  contact: {
    title: "Contact",
    description:
      "Send feedback, report incorrect dish information, or ask about photos.",
    body: [
      "Let us know if dish information (price, ingredients, spiciness) is far off, or if there's a dish you'd like us to add. Requests about photo copyright are also handled by email.",
      "We usually reply within three business days.",
    ],
    emailLabel: "Email",
  },
  menus: {
    title: "Dish guide",
    description:
      "250 dishes in 8 cuisines — Korean, Chinese, Japanese, Western, Korean snacks, Asian, fast food and BBQ — with photos.",
    intro:
      "Here are all 250 dishes Gollajuke recommends, grouped into 8 cuisines. For each cuisine you'll find what makes it distinctive, tips for choosing, and each dish's rough price, spiciness and main ingredients.",
    metaTitle:
      "Dish guide: 250 dishes in 8 cuisines with prices and spice levels",
    count: "{count} dishes",
    categoryTitle: "{name}: {count} dishes, prices and spice levels",
    categoryHeading: "{name}: {count} dishes",
    categoryFacts:
      "About {min}–{max} per person · {mild} not spicy · {hot} served warm",
    categoryDescription:
      "{count} {name} dishes with photos, about {min}–{max} per person, {mild} of them not spicy. Also what the cuisine is like, tips for choosing, and each dish's spice level and main ingredients.",
    tipsTitle: "Tips for choosing",
    listTitle: "Dishes",
    allergens: "Main ingredients",
    noAllergens: "No major allergens listed",
    photoBy: "Photo",
    back: "Back to the dish guide",
    others: "Other cuisines",
  },
  guides: {
    title: "Guides to choosing a meal",
    description:
      "How to decide on lunch fast, choose by mood and weather, by group size, and when you have allergies.",
    intro:
      "If choosing a meal wears you out every day, setting a few simple rules makes it much easier. Here are approaches for different situations.",
    back: "All guides",
    related: "More guides",
  },
  credits: {
    title: "Photo credits",
    description:
      "Authors and licenses of the food photos used on Gollajuke, listed by dish.",
    intro:
      "All food photos on Gollajuke are freely licensed images from Wikimedia Commons, cropped to 4:3 and resized for the site. Authors, licenses and source pages are listed below. Dishes without a photo are ones for which we couldn't find a suitable freely licensed image.",
    noPhoto: "No photo",
    source: "Source",
  },
  notFound: {
    title: "Page not found",
    body: "The address may have changed or the page doesn't exist. Start again below.",
    home: "Pick a meal",
  },
};

const ja: PageText = {
  about: {
    title: "ゴラジュケについて",
    description:
      "ゴラジュケがメニュー選びの時間を短くする仕組み、3品を選ぶ基準、断った理由から学ぶ方法、データと写真の出典を説明します。",
    intro: [
      "ゴラジュケ（韓国語で「選んであげる」）は、「今日なに食べよう？」に使う時間を短くするために作りました。デリバリーアプリをずっとスクロールしたり、グループチャットで「なんでもいい」が続いたりして、お昼休みが半分終わってしまったことがあるなら、その時間を取り戻すためのサービスです。",
      "選択肢が多いほど、かえって決められなくなります。そこで250品の中から食べられないものと今日の気分に合わないものを先に外し、異なるジャンルから3品だけ残します。カードごとにそのメニューを選んだ理由を書いているので、もう一度考え直さずにひとつ選ぶだけ。ルーレットのように適当に引かず最後の一品を自分で選ぶようにしたのも、自分で決めたものなら後で迷い直しにくいからです。",
      "会員登録もサーバーもありません。おすすめの計算はすべてお使いの端末の中で行われ、好みや食事の記録もこのブラウザにだけ保存されます。",
    ],
    sections: [
      {
        heading: "抜いてね・合わせてね",
        body: [
          "「抜いてね」では、食べられない食材（乳・卵・小麦・エビカニなど11種）、今日は避けたいジャンル、昨日食べたメニューを先に除きます。ここで除いたメニューはどんな場合もおすすめされません。",
          "「合わせてね」では、空腹度、気分、季節、食べたい調理法（スープ、チゲ・鍋、炒め物、蒸し物・煮物など）、一緒に食べる人、1人あたりの予算を選びます。すべての質問に「こだわらない」があるので、迷う項目は飛ばしてかまいません。選んでいる間、画面下に残りの候補数がすぐ表示されます。",
        ],
      },
      {
        heading: "3品はこう違います",
        body: [
          "「定番の一品」は今日の状態とこれまでの好みに最も合うメニューです。「今の気分にぴったり」は好みを除き、今の状態（どのくらいがっつり、温かいものを食べたいか）だけを見たメニューです。「新しい挑戦」はまだあまりおすすめされていないメニューから選びます。",
          "3品はいつも異なるジャンル（韓国料理、中華、和食など）から選ばれます。似たメニュー3つの中でまた迷わないようにするためです。カードには選んだ理由も載せています。入力した条件のうち、実際に当てはまったものだけです。",
        ],
      },
      {
        heading: "断ると学習します",
        body: [
          "「ほかのにして」を押して理由を選ぶと、すぐに選び直します。「昨日食べた」なら2日間そのメニューを外し、「脂っこい」ならそれより軽いものを、「高い」ならそれより安いものを探します。「なんとなく嫌」ならそのジャンルの点数を少し下げ、次回以降にも反映します。",
        ],
      },
      {
        heading: "データと写真",
        body: [
          "250品の価格、辛さ、ボリューム、脂っこさ、主な食材は、一般的なレシピと韓国の飲食店の価格を参考に運営者がまとめました。価格は1人前のおおよその金額で、地域や店によって異なります。",
          "料理の写真は Wikimedia Commons で自由ライセンス（CC0、CC BY、CC BY-SA など）で公開されているものです。作者とライセンスは写真のクレジットページでメニューごとに確認できます。",
        ],
      },
    ],
    faqTitle: "よくある質問",
    faq: [
      {
        q: "アレルギー情報は信頼できますか？",
        a: "一般的なレシピに基づく参考情報です。同じメニューでも店によって食材が異なります。アレルギーがある方は必ずお店に直接確認してください。",
      },
      {
        q: "好みや記録はどこに保存されますか？",
        a: "このブラウザのストレージ（localStorage）にだけ保存されます。サーバーには送信せず、ブラウザのデータを消去すると一緒に削除されます。",
      },
      {
        q: "同じメニューばかり出てきます。",
        a: "「ほかのにして」を押して理由を選んでください。理由に合わせて条件が変わり、「新しい挑戦」はよく見たメニューほど出にくくなります。",
      },
      {
        q: "海外でも使えますか？",
        a: "はい。英語・日本語・中国語でも利用できます。ただし価格は韓国の飲食店が基準で、韓国語以外の画面では「近くを探す」が Google マップにつながります。",
      },
    ],
  },
  privacy: {
    title: "プライバシーポリシー",
    description:
      "ゴラジュケがどの情報をどこに保存し、広告 Cookie をどう使うかを説明します。",
    updated: "施行日：2026年10月19日",
    sections: [
      {
        heading: "1. 収集する情報",
        body: [
          "ゴラジュケには会員登録がなく、氏名・電話番号・メールアドレスなどの個人情報を受け取りません。運営者が管理するサーバーやデータベースもありません。",
        ],
      },
      {
        heading: "2. 端末に保存される情報",
        body: [
          "おすすめのために入力した条件、断った理由から学習したジャンル別の好み、メニューごとのおすすめ回数、食事の記録（メニューと日付）、使い方の案内を見たかどうかを、このブラウザの localStorage に保存します。これらの情報は端末の外に送信されず、ブラウザ設定でサイトデータを消去するとすぐに削除されます。",
        ],
      },
      {
        heading: "3. 広告・アクセス解析と Cookie",
        body: [
          "当サイトは Google AdSense による広告を掲載する場合があります。Google などの第三者配信事業者は Cookie を使用して、ユーザーが当サイトや他のサイトに過去にアクセスした情報に基づいて広告を配信します。",
          "Google は広告 Cookie を使用することにより、ユーザーが当サイトやインターネット上の他のサイトにアクセスした情報に基づいて広告を配信できます。パーソナライズ広告は Google 広告設定（https://adssettings.google.com）で無効にでき、www.aboutads.info で他の第三者配信事業者の Cookie も無効にできます。",
          "Google がパートナーサイトのデータをどのように使用するかは https://policies.google.com/technologies/partner-sites で確認できます。",
          "利用状況を把握するため、すべてのページで Google アナリティクスを使用しています。閲覧したページ、滞在時間、おおよその地域、端末・ブラウザの情報などが Google に送信され、そのために Google アナリティクスの Cookie（_ga など）が保存される場合があります。端末に保存された入力条件や食事の記録は送信しません。収集を望まない場合は、Google アナリティクス オプトアウト アドオン（https://tools.google.com/dlpage/gaoptout）を使うか、ブラウザで Cookie をブロックしてください。",
        ],
      },
      {
        heading: "4. 外部リンク",
        body: [
          "「近くを探す」ボタンはカカオマップまたは Google マップの検索結果につながり、メニュー名が検索語として渡されます。それ以降は各サービスのプライバシーポリシーに従います。",
        ],
      },
      {
        heading: "5. お問い合わせ",
        body: [
          "個人情報に関するお問い合わせは、下記のメールアドレスまでお送りください。",
        ],
      },
    ],
  },
  contact: {
    title: "お問い合わせ",
    description:
      "ご意見、メニュー情報の誤りの報告、写真に関するお問い合わせを受け付けています。",
    body: [
      "メニュー情報（価格・食材・辛さ）が実際と大きく違う場合や、追加してほしいメニューがあればお知らせください。写真の著作権に関するご依頼もメールで受け付けています。",
      "通常3営業日以内に返信します。",
    ],
    emailLabel: "メール",
  },
  menus: {
    title: "料理図鑑",
    description:
      "韓国料理・中華・和食・洋食・粉食・アジア料理・ファストフード・焼肉の8ジャンル250品を写真付きでまとめました。",
    intro:
      "ゴラジュケがおすすめする250品を8つのジャンルに分けてまとめました。ジャンルごとの特徴と選ぶときのコツ、メニューごとのおおよその価格と辛さ、主な食材を確認できます。",
    metaTitle: "料理図鑑：8ジャンル250品の価格・辛さ・食材",
    count: "{count}品",
    categoryTitle: "{name}メニュー{count}品：価格・辛さ・食材まとめ",
    categoryHeading: "{name}メニュー{count}品",
    categoryFacts:
      "1人あたり約{min}〜{max} · 辛くない{mild}品 · 温かい料理{hot}品",
    categoryDescription:
      "{name}メニュー{count}品を写真付きでまとめました。1人あたり約{min}〜{max}、辛くないメニューは{mild}品。ジャンルの特徴や選ぶコツ、メニューごとの辛さと主な食材もわかります。",
    tipsTitle: "選ぶときのコツ",
    listTitle: "メニュー一覧",
    allergens: "主な食材",
    noAllergens: "表示する主なアレルギー食材なし",
    photoBy: "写真",
    back: "料理図鑑へ",
    others: "ほかのジャンル",
  },
  guides: {
    title: "メニュー選びガイド",
    description:
      "ランチを早く決めるコツから、気分・天気別、人数別、アレルギーがあるときの選び方までまとめました。",
    intro:
      "毎回メニュー選びで疲れてしまうなら、いくつか基準を決めておくだけでずっと楽になります。状況別に役立つ方法をまとめました。",
    back: "ガイド一覧",
    related: "ほかのガイド",
  },
  credits: {
    title: "写真のクレジット",
    description:
      "ゴラジュケで使用している料理写真の作者とライセンスをメニューごとに記載します。",
    intro:
      "ゴラジュケの料理写真はすべて Wikimedia Commons で自由ライセンスとして公開されているものです。画面に合わせて4:3にトリミングし、縮小しています。作者、ライセンス、元のページは以下のとおりです。写真のないメニューは、適切な自由ライセンスの写真が見つからなかったものです。",
    noPhoto: "写真なし",
    source: "元のページ",
  },
  notFound: {
    title: "ページが見つかりません",
    body: "アドレスが変わったか、存在しないページです。下からもう一度始めてください。",
    home: "メニューを選びに行く",
  },
};

const zh: PageText = {
  about: {
    title: "关于 Gollajuke",
    description:
      "介绍 Gollajuke 如何帮你缩短选菜时间、挑出 3 道菜的标准、如何从你的拒绝中学习，以及数据与照片的来源。",
    intro: [
      "Gollajuke（韩语“帮你选”）是为了缩短“今天吃什么”所花的时间而做的。如果你也曾在外卖 App 里刷了半天，或者群聊里一直“随便”，午休就过去了一半，我们想帮你省下的正是这段时间。",
      "选项越多，反而越难做决定。所以我们先从 250 道菜里去掉不能吃的和今天不想吃的，再从不同类别里只留下 3 道。每张卡片都写着为什么选它，不用再重新比较，挑一道就行。没有像轮盘那样随便抽，而是把最后的选择留给你，是因为自己做的决定，事后更不容易反悔。",
      "无需注册，也没有服务器。所有推荐都在你当前使用的设备上计算，口味和就餐记录也只保存在这个浏览器里。",
    ],
    sections: [
      {
        heading: "帮我去掉、帮我匹配",
        body: [
          "在“帮我去掉”里，先去掉不能吃的食材（牛奶、鸡蛋、小麦、虾蟹等 11 类）、今天不想吃的类别和昨天吃过的菜。这里去掉的菜在任何情况下都不会被推荐。",
          "在“帮我匹配”里，选择饥饿程度、心情、季节、想吃的做法（汤、炖锅、炒菜、蒸菜·炖菜等）、同伴和人均预算。每个问题都有“都可以”，拿不准的可以跳过。选择过程中，屏幕下方会立即显示剩余候选数量。",
        ],
      },
      {
        heading: "3 道菜的区别",
        body: [
          "“稳妥之选”最符合你今天的状态和积累下来的口味。“正合心情”不看口味，只看你现在的状态（想吃多饱、想吃热的还是凉的）。“尝鲜挑战”从你较少看到的菜里挑选。",
          "3 道菜总是来自不同类别（韩餐、中餐、日料等），免得你又在 3 道相似的菜里纠结。卡片上还会写出推荐理由，只列出你输入的条件中真正符合的那些。",
        ],
      },
      {
        heading: "拒绝也会学习",
        body: [
          "点“换一个”并选择原因，就会马上重新挑选。选“昨天吃过”会在两天内不再推荐这道菜；选“太油腻”会找更清淡的；选“太贵”会找更便宜的；选“就是不想吃”会稍微降低该类别的分数，并影响之后的推荐。",
        ],
      },
      {
        heading: "数据与照片",
        body: [
          "250 道菜的价格、辣度、饱腹感、油腻程度和主要食材，由运营者参考常见做法和韩国餐厅价格整理而成。价格为人均大致金额，因地区和店铺而异。",
          "菜品照片来自 Wikimedia Commons 上以自由许可（CC0、CC BY、CC BY-SA 等）公开的图片。每张照片的作者和许可协议可在图片来源页面查看。",
        ],
      },
    ],
    faqTitle: "常见问题",
    faq: [
      {
        q: "过敏信息可靠吗？",
        a: "这是基于常见做法的参考信息。同一道菜在不同店铺所用食材可能不同。如有过敏，请务必直接向餐厅确认。",
      },
      {
        q: "我的口味和记录保存在哪里？",
        a: "只保存在这个浏览器的存储（localStorage）中，不会发送到服务器。清除浏览器数据后会一并删除。",
      },
      {
        q: "总是出现同一道菜。",
        a: "请点“换一个”并选择原因。条件会随之改变，而且“尝鲜挑战”会让你常看到的菜更少出现。",
      },
      {
        q: "在韩国以外也能用吗？",
        a: "可以。网站提供英语、日语和中文版本。不过价格以韩国餐厅为准，非韩语页面的“查找附近”会打开 Google 地图。",
      },
    ],
  },
  privacy: {
    title: "隐私政策",
    description:
      "说明 Gollajuke 保存哪些信息、保存在哪里，以及如何使用广告 Cookie。",
    updated: "生效日期：2026 年 10 月 19 日",
    sections: [
      {
        heading: "1. 收集的信息",
        body: [
          "Gollajuke 没有会员注册，不收集姓名、电话号码、电子邮件等个人信息。运营者也不运行任何服务器或数据库。",
        ],
      },
      {
        heading: "2. 保存在设备上的信息",
        body: [
          "为了推荐，本网站会在此浏览器的 localStorage 中保存你输入的条件、从拒绝中学到的各类别偏好、每道菜被推荐的次数、就餐记录（菜名和日期），以及是否看过使用说明。这些信息不会离开你的设备，在浏览器设置中清除网站数据即可立即删除。",
        ],
      },
      {
        heading: "3. 广告、访问统计与 Cookie",
        body: [
          "本网站可能通过 Google AdSense 展示广告。包括 Google 在内的第三方供应商会使用 Cookie，根据你过去访问本网站或其他网站的记录投放广告。",
          "Google 使用广告 Cookie，使其及其合作伙伴能够根据你访问本网站和互联网上其他网站的记录投放广告。你可以在 Google 广告设置（https://adssettings.google.com）中关闭个性化广告，也可以在 www.aboutads.info 关闭其他第三方供应商的 Cookie。",
          "关于 Google 如何使用合作伙伴网站的数据，请参阅 https://policies.google.com/technologies/partner-sites。",
          "为了解网站的使用情况，所有页面都使用 Google Analytics。你访问的页面、停留时间、大致地区以及设备和浏览器信息会发送给 Google，为此可能会存储 Google Analytics Cookie（如 _ga）。保存在设备上的输入条件和就餐记录不会被发送。如不希望被收集，可以使用 Google Analytics 停用浏览器插件（https://tools.google.com/dlpage/gaoptout），或在浏览器中阻止 Cookie。",
        ],
      },
      {
        heading: "4. 外部链接",
        body: [
          "“查找附近”按钮会打开 Kakao 地图或 Google 地图的搜索结果，并将菜名作为搜索词传递。之后适用各服务自己的隐私政策。",
        ],
      },
      {
        heading: "5. 联系方式",
        body: ["有关隐私的问题，请发送邮件至以下地址。"],
      },
    ],
  },
  contact: {
    title: "联系我们",
    description: "欢迎提出意见、报告菜品信息错误或咨询照片相关事宜。",
    body: [
      "如果菜品信息（价格、食材、辣度）与实际差距较大，或有希望添加的菜品，请告诉我们。关于照片版权的请求也通过邮件受理。",
      "我们通常会在 3 个工作日内回复。",
    ],
    emailLabel: "电子邮件",
  },
  menus: {
    title: "菜品百科",
    description:
      "按韩餐、中餐、日料、西餐、韩式小吃、亚洲菜、快餐、烤肉 8 个类别整理了 250 道菜，并附照片。",
    intro:
      "这里按 8 个类别整理了 Gollajuke 推荐的全部 250 道菜。每个类别都有特点介绍和挑选技巧，还能看到每道菜的大致价格、辣度和主要食材。",
    metaTitle: "菜品百科：8 类 250 道菜的价格、辣度和食材",
    count: "{count} 道菜",
    categoryTitle: "{count} 道{name}：价格、辣度和食材一览",
    categoryHeading: "{count} 道{name}",
    categoryFacts: "人均约 {min}~{max} · 不辣 {mild} 道 · 热菜 {hot} 道",
    categoryDescription:
      "收录 {count} 道{name}，附照片，人均约 {min}~{max}，其中 {mild} 道不辣。还能看到这类菜的特点、挑选技巧，以及每道菜的辣度和主要食材。",
    tipsTitle: "挑选技巧",
    listTitle: "菜品列表",
    allergens: "主要食材",
    noAllergens: "无需标注的主要过敏食材",
    photoBy: "照片",
    back: "返回菜品百科",
    others: "其他类别",
  },
  guides: {
    title: "选菜指南",
    description:
      "从快速决定午饭，到按心情和天气、按人数、有过敏时如何选菜，都整理在这里。",
    intro:
      "如果每次选菜都让你很累，只要定下几个标准就会轻松很多。这里整理了不同情况下有用的方法。",
    back: "指南列表",
    related: "更多指南",
  },
  credits: {
    title: "图片来源",
    description: "按菜品列出 Gollajuke 所用菜品照片的作者和许可协议。",
    intro:
      "Gollajuke 的菜品照片全部来自 Wikimedia Commons 上以自由许可公开的图片，并按页面需要裁剪为 4:3 并缩小。作者、许可协议和原始页面如下。没有照片的菜品，是我们没能找到合适自由许可图片的菜。",
    noPhoto: "无照片",
    source: "原始页面",
  },
  notFound: {
    title: "找不到页面",
    body: "地址可能已更改，或该页面不存在。请从下方重新开始。",
    home: "去选菜",
  },
};

export const PAGE_TEXT: Record<Locale, PageText> = { ko, en, ja, zh };
