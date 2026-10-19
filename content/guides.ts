import type { Locale } from "@/i18n/config";

// 메뉴 고르기 가이드 글. 운영자가 직접 쓴 글이다(한국어 원본 + 번역).
interface GuideBody {
  title: string;
  description: string;
  sections: { heading: string; body: string[] }[];
}
export interface Guide {
  slug: string;
  emoji: string;
  text: Record<Locale, GuideBody>;
}

export const GUIDES: Guide[] = [
  {
    slug: "quick-lunch",
    emoji: "⏱️",
    text: {
      ko: {
        title: "점심 메뉴, 3분 안에 정하는 법",
        description:
          "매일 반복되는 점심 메뉴 고민을 줄이는 세 가지 기준과 골라주께로 빠르게 정하는 순서를 소개합니다.",
        sections: [
          {
            heading: "고민이 길어지는 이유",
            body: [
              '메뉴를 못 정하는 건 선택지가 너무 많기 때문이에요. 회사 근처 식당만 떠올려도 수십 곳이고, 각자 "아무거나"라고 말하지만 막상 제안하면 "그건 좀…"이 돌아오죠. 고를 게 많을수록 결정은 더 피곤해지고, 결국 늘 먹던 곳으로 가게 돼요.',
              "그래서 처음부터 좋은 메뉴를 찾기보다, 안 되는 것부터 지우고 후보를 몇 개로 줄이는 쪽이 훨씬 빨라요.",
            ],
          },
          {
            heading: "기준 세 가지만 정하기",
            body: [
              "첫째, 오늘 못 먹거나 싫은 것을 먼저 빼요. 어제 먹은 메뉴, 오늘은 피하고 싶은 종류(예: 튀김), 알레르기 재료가 여기에 해당해요.",
              "둘째, 배고픈 정도를 정해요. 오후에 회의가 많아 가볍게 먹고 싶은지, 저녁이 늦어 든든하게 먹어야 하는지만 정해도 후보가 절반 가까이 줄어요.",
              '셋째, 예산 상한을 정해요. "1만 원까지"처럼 숫자 하나만 정하면 비싼 메뉴를 두고 고민할 일이 없어요.',
            ],
          },
          {
            heading: "골라주께로 정하는 순서",
            body: [
              '빼주께에서 어제 먹은 것과 싫은 종류를 빼고, 맞춰주께에서 배고픈 정도와 예산만 고른 뒤 "3개 골라줘"를 누르세요. 기분과 동행은 모르겠으면 "상관없어"로 두면 돼요.',
              '세 메뉴는 서로 다른 종류라 비교가 쉬워요. 마음에 안 드는 메뉴는 "다른 거"를 누르고 이유를 한 번만 고르면 바로 바뀌어요.',
            ],
          },
          {
            heading: "그래도 못 정하겠다면",
            body: [
              "세 개 중 가장 덜 싫은 걸 고르세요. 완벽한 메뉴보다 지금 정하는 게 중요해요. 먹은 걸로 기록해 두면 이틀 동안은 같은 메뉴가 다시 추천되지 않아서, 내일은 자연스럽게 다른 메뉴가 나와요.",
            ],
          },
        ],
      },
      en: {
        title: "How to decide on lunch in three minutes",
        description:
          "Three simple rules to cut down the daily lunch debate, and the fastest way to decide with Gollajuke.",
        sections: [
          {
            heading: "Why deciding takes so long",
            body: [
              'You can\'t decide because there are too many options. There are dozens of places near the office, everyone says "anything is fine", yet every suggestion gets a "hmm, not that." The more choices you have, the more tiring the decision becomes, and you end up at the usual place again.',
              "Instead of hunting for the perfect dish, it's much faster to cross out what won't work and narrow down to a few candidates.",
            ],
          },
          {
            heading: "Set just three rules",
            body: [
              "First, remove what you can't or don't want to eat today: what you had yesterday, cuisines you want to skip (say, fried food), and ingredients you're allergic to.",
              "Second, decide how hungry you are. Just deciding whether you want something light before afternoon meetings, or something filling because dinner will be late, cuts the options nearly in half.",
              'Third, set a budget cap. A single number like "up to ₩10,000" stops you from agonizing over expensive dishes.',
            ],
          },
          {
            heading: "The Gollajuke way",
            body: [
              "Under Leave out, remove yesterday's meal and cuisines you don't want. Under Match me, choose only your hunger and budget, then tap Pick 3 for me. If you're unsure about mood and company, leave them on Any.",
              "The three picks come from different cuisines, so they're easy to compare. If you don't like one, tap Something else and choose a single reason to swap it right away.",
            ],
          },
          {
            heading: "Still can't decide?",
            body: [
              "Pick the one you mind least. Deciding now matters more than finding the perfect meal. Mark it as eaten and the same dish won't be suggested for two days, so tomorrow naturally brings something different.",
            ],
          },
        ],
      },
      ja: {
        title: "ランチのメニューを3分で決めるコツ",
        description:
          "毎日のランチの悩みを減らす3つの基準と、ゴラジュケで素早く決める手順を紹介します。",
        sections: [
          {
            heading: "迷いが長引く理由",
            body: [
              "メニューが決まらないのは選択肢が多すぎるからです。会社の近くの店だけでも何十軒もあり、みんな「なんでもいい」と言うのに、提案すると「それはちょっと…」と返ってきます。選ぶものが多いほど決断は疲れ、結局いつもの店に行くことになります。",
              "最初から良いメニューを探すより、ダメなものから消して候補を数個に絞るほうがずっと早いです。",
            ],
          },
          {
            heading: "基準は3つだけ",
            body: [
              "1つ目は、今日食べられないもの・嫌なものを先に外すこと。昨日食べたメニュー、今日は避けたいジャンル（例：揚げ物）、アレルギー食材がこれにあたります。",
              "2つ目は空腹度を決めること。午後に会議が多いので軽めにしたいのか、夕食が遅いのでしっかり食べたいのかを決めるだけで、候補は半分近くに減ります。",
              "3つ目は予算の上限を決めること。「1万ウォンまで」のように数字をひとつ決めれば、高いメニューで迷うことがなくなります。",
            ],
          },
          {
            heading: "ゴラジュケで決める手順",
            body: [
              "「抜いてね」で昨日食べたものと嫌なジャンルを外し、「合わせてね」で空腹度と予算だけ選んで「3つ選んで」を押しましょう。気分と同行者は迷ったら「こだわらない」のままで大丈夫です。",
              "3品はそれぞれ違うジャンルなので比べやすいです。気に入らないメニューは「ほかのにして」を押して理由を1つ選ぶだけですぐ入れ替わります。",
            ],
          },
          {
            heading: "それでも決められないなら",
            body: [
              "3つの中で一番イヤじゃないものを選びましょう。完璧なメニューより、今決めることが大切です。「食べたことにする」で記録しておけば2日間は同じメニューが出ないので、明日は自然と別のメニューになります。",
            ],
          },
        ],
      },
      zh: {
        title: "3 分钟内决定午饭吃什么",
        description:
          "介绍减少每天午饭纠结的三个标准，以及用 Gollajuke 快速决定的步骤。",
        sections: [
          {
            heading: "为什么总是纠结",
            body: [
              "决定不了是因为选项太多。公司附近的餐厅就有几十家，大家都说“随便”，可一提议就是“那个不太想吃……”。选择越多，决定越累，最后又去了老地方。",
              "与其一开始就找最好的菜，不如先划掉不行的，把候选缩小到几个，这样快得多。",
            ],
          },
          {
            heading: "只定三个标准",
            body: [
              "第一，先去掉今天不能吃或不想吃的：昨天吃过的菜、今天想避开的类别（比如油炸食品）、过敏食材。",
              "第二，确定饥饿程度。下午会多想吃清淡点，还是晚饭晚要吃饱点，光定下这一点，候选就能减少近一半。",
              "第三，定好预算上限。只要定一个数字，比如“1 万韩元以内”，就不用在贵的菜之间纠结了。",
            ],
          },
          {
            heading: "用 Gollajuke 的步骤",
            body: [
              "在“帮我去掉”里去掉昨天吃过的和不想吃的类别，在“帮我匹配”里只选饥饿程度和预算，然后点“帮我选 3 道”。心情和同伴拿不准就保持“都可以”。",
              "3 道菜来自不同类别，很容易比较。不喜欢的菜点“换一个”，选一个原因就能马上换掉。",
            ],
          },
          {
            heading: "还是决定不了的话",
            body: [
              "从 3 道里选最不讨厌的那道。比起完美的菜，现在做决定更重要。点“记为已吃”后，两天内不会再推荐同一道菜，明天自然就会换成别的。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "mood-and-weather",
    emoji: "🌦️",
    text: {
      ko: {
        title: "기분과 날씨에 맞춰 메뉴 고르기",
        description:
          "피곤한 날, 스트레스 받은 날, 비 오는 날, 더운 날에 어울리는 메뉴를 고르는 기준을 정리했습니다.",
        sections: [
          {
            heading: "상태를 두 가지로 나눠 보기",
            body: [
              '기분과 날씨에 맞는 메뉴를 고를 때는 복잡하게 생각할 필요 없이 두 가지만 보면 돼요. 얼마나 든든하게 먹고 싶은지, 그리고 따뜻한 게 당기는지 시원한 게 당기는지예요. 골라주께도 이 두 가지를 기준으로 "오늘 상태에 딱" 메뉴를 골라요.',
            ],
          },
          {
            heading: "피곤한 날",
            body: [
              '몸이 지친 날엔 따뜻하고 든든한 음식이 위로가 돼요. 국밥, 갈비탕, 삼계탕처럼 국물이 있는 메뉴나 돈코츠라멘이 잘 맞아요. 골라주께에서 기분을 "피곤"으로 고르면 따뜻하고 든든한 메뉴 쪽으로 추천이 기울어요.',
            ],
          },
          {
            heading: "스트레스 받은 날",
            body: [
              "스트레스를 받으면 자극적인 맛이 당기기 쉬워요. 떡볶이, 짬뽕, 마라탕처럼 매운 메뉴나 치킨처럼 든든한 메뉴가 대표적이에요. 다만 매운 음식은 속이 약한 날 부담이 될 수 있으니, 다음 날 일정을 생각해서 맵기를 고르세요.",
            ],
          },
          {
            heading: "비 오는 날과 추운 날",
            body: [
              "비가 오거나 쌀쌀하면 해물파전이나 칼국수, 수제비처럼 따뜻한 밀가루 음식이 생각나는 사람이 많아요. 국물 요리 전체가 잘 어울리고, 배달을 시킨다면 국물이 덜 식는 찌개류가 좋아요.",
            ],
          },
          {
            heading: "더운 날",
            body: [
              '더운 날엔 물냉면, 콩국수, 자루소바, 냉짬뽕처럼 차가운 면이 입맛을 살려요. 기름진 음식이 부담스럽다면 "다른 거"에서 "느끼함"을 눌러 보세요. 그보다 덜 기름진 메뉴로만 다시 골라 줘요.',
            ],
          },
          {
            heading: "기념하고 싶은 날",
            body: [
              '축하할 일이 있는 날엔 평소에 잘 안 먹던 메뉴에 도전해 보세요. 기분을 "기념"으로 고르면 "새로운 도전" 칸이 덜 먹어 본 메뉴를 더 적극적으로 추천해요. 예산은 직접 정한 만큼만 쓰도록 그대로 지켜요.',
            ],
          },
        ],
      },
      en: {
        title: "Choosing a meal by mood and weather",
        description:
          "How to pick a dish for tired days, stressful days, rainy days and hot days.",
        sections: [
          {
            heading: "Think in two dimensions",
            body: [
              "You don't need to overthink matching food to your mood or the weather. Just ask two things: how filling do you want it, and are you craving something warm or cool? Gollajuke uses exactly these two factors for its Fits your mood pick.",
            ],
          },
          {
            heading: "Tired days",
            body: [
              "When you're worn out, warm and filling food is comforting. Soupy dishes like gukbap, galbitang and samgyetang, or tonkotsu ramen, are good choices. Choose Tired as your mood and the picks lean toward warm, hearty dishes.",
            ],
          },
          {
            heading: "Stressful days",
            body: [
              "Stress often makes you crave bold flavors: spicy dishes like tteokbokki, jjamppong and malatang, or something filling like fried chicken. Spicy food can be hard on a sensitive stomach, though, so pick your heat level with tomorrow's plans in mind.",
            ],
          },
          {
            heading: "Rainy and cold days",
            body: [
              "On rainy or chilly days, many Koreans crave warm flour-based dishes like seafood pancake, kalguksu and sujebi. Any soup works well, and for delivery, stews keep their heat better.",
            ],
          },
          {
            heading: "Hot days",
            body: [
              "On hot days, cold noodles such as mul naengmyeon, kongguksu, zaru soba and cold jjamppong bring back your appetite. If greasy food feels heavy, tap Something else and then Too greasy. We'll only pick dishes lighter than that one.",
            ],
          },
          {
            heading: "Days worth celebrating",
            body: [
              "When there's something to celebrate, try a dish you rarely eat. Choose Celebrating as your mood and the Try something new slot pushes harder toward dishes you haven't seen much. Your budget stays exactly as you set it.",
            ],
          },
        ],
      },
      ja: {
        title: "気分と天気に合わせたメニューの選び方",
        description:
          "疲れた日、ストレスがたまった日、雨の日、暑い日に合うメニューを選ぶ基準をまとめました。",
        sections: [
          {
            heading: "状態を2つに分けて考える",
            body: [
              "気分や天気に合うメニューを選ぶとき、難しく考える必要はありません。どのくらいがっつり食べたいか、温かいものと冷たいもののどちらが食べたいか、この2つだけ見ればOKです。ゴラジュケもこの2つを基準に「今の気分にぴったり」のメニューを選びます。",
            ],
          },
          {
            heading: "疲れた日",
            body: [
              "疲れた日は、温かくてボリュームのある料理が癒やしになります。クッパ、カルビタン、サムゲタンのようなスープ料理や豚骨ラーメンがよく合います。ゴラジュケで気分を「疲れた」にすると、温かくがっつりしたメニュー寄りにおすすめが変わります。",
            ],
          },
          {
            heading: "ストレスがたまった日",
            body: [
              "ストレスがたまると刺激的な味が欲しくなりがちです。トッポッキ、チャンポン、麻辣燙のような辛いメニューや、チキンのようにボリュームのあるメニューが代表的です。ただし辛い料理は胃が弱っている日には負担になるので、翌日の予定も考えて辛さを選びましょう。",
            ],
          },
          {
            heading: "雨の日・寒い日",
            body: [
              "雨の日や肌寒い日には、海鮮チヂミやカルグクス、スジェビのような温かい粉もの料理が恋しくなる人が多いです。スープ料理全般がよく合い、デリバリーならスープが冷めにくいチゲ類がおすすめです。",
            ],
          },
          {
            heading: "暑い日",
            body: [
              "暑い日は水冷麺、コングクス、ざるそば、冷やしチャンポンのような冷たい麺が食欲を取り戻してくれます。脂っこいものが重く感じたら「ほかのにして」で「脂っこい」を押してみてください。それより脂の少ないメニューだけで選び直します。",
            ],
          },
          {
            heading: "お祝いしたい日",
            body: [
              "お祝いごとがある日は、普段あまり食べないメニューに挑戦してみましょう。気分を「お祝い」にすると、「新しい挑戦」枠があまり食べたことのないメニューをより積極的におすすめします。予算は自分で決めた分だけ、そのまま守ります。",
            ],
          },
        ],
      },
      zh: {
        title: "按心情和天气选菜",
        description: "整理了疲惫、有压力、下雨、炎热时如何挑选合适菜品的标准。",
        sections: [
          {
            heading: "把状态分成两个维度",
            body: [
              "按心情和天气选菜不必想得太复杂，只看两点：想吃得多饱，以及想吃热的还是凉的。Gollajuke 也是按这两点来挑“正合心情”的菜。",
            ],
          },
          {
            heading: "疲惫的时候",
            body: [
              "身体疲惫时，热乎又管饱的食物最能慰藉人。汤饭、排骨汤、参鸡汤这类带汤的菜，或豚骨拉面都很合适。在 Gollajuke 里把心情选为“累了”，推荐就会偏向热乎、管饱的菜。",
            ],
          },
          {
            heading: "有压力的时候",
            body: [
              "压力大时容易想吃重口味，比如辣炒年糕、炒码面、麻辣烫这类辣菜，或炸鸡这样管饱的菜。不过肠胃不适时辣菜可能是负担，选择辣度时也考虑一下第二天的安排。",
            ],
          },
          {
            heading: "下雨天和冷天",
            body: [
              "下雨或天凉时，很多人会想吃海鲜葱饼、刀切面、面片汤这类热乎的面食。各种汤菜都很合适，点外卖的话，炖锅类更不容易变凉。",
            ],
          },
          {
            heading: "炎热的时候",
            body: [
              "天热时，水冷面、豆浆面、荞麦冷面、冷炒码面等凉面能让人重拾胃口。觉得油腻食物有负担，可以在“换一个”里点“太油腻”，就只会从更清淡的菜里重新挑选。",
            ],
          },
          {
            heading: "想庆祝的时候",
            body: [
              "有喜事时，不妨挑战平时很少吃的菜。把心情选为“庆祝”，“尝鲜挑战”栏会更积极地推荐你很少吃的菜。预算仍然严格按你设定的来。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "eating-together",
    emoji: "👥",
    text: {
      ko: {
        title: "혼밥, 둘이, 여럿이: 인원별 메뉴 고르기",
        description:
          "혼자 먹을 때, 둘이 먹을 때, 여럿이 먹을 때 메뉴를 고르는 요령과 의견을 빨리 모으는 방법을 소개합니다.",
        sections: [
          {
            heading: "혼자 먹을 때",
            body: [
              "혼밥은 1인분 주문이 되는지가 가장 중요해요. 국밥, 덮밥, 라멘, 김밥, 버거처럼 한 그릇이나 한 세트로 끝나는 메뉴가 편해요. 고기구이나 전골은 2인분부터 받는 가게가 많아서 혼자라면 미리 확인하는 게 좋아요.",
              '혼자일 때는 남의 눈치를 볼 필요가 없으니 "새로운 도전" 칸의 메뉴를 시도해 보기에도 좋은 기회예요.',
            ],
          },
          {
            heading: "둘이 먹을 때",
            body: [
              "둘이라면 서로 다른 메뉴를 시켜 나눠 먹는 방법이 좋아요. 골라주께의 3픽은 서로 다른 종류에서 나오니까, 둘이 각자 하나씩 고르고 나머지 하나는 다음에 먹을 후보로 남겨 두세요.",
              "한 사람이라도 못 먹는 재료가 있다면 빼주께에서 먼저 빼 주세요. 그러면 둘 다 먹을 수 있는 메뉴만 나와요.",
            ],
          },
          {
            heading: "여럿이 먹을 때",
            body: [
              "여럿이면 모두의 제약을 먼저 모으는 게 가장 빨라요. 못 먹는 재료, 피하고 싶은 종류, 1인 예산을 한 번에 물어보고 빼주께에 모두 넣으세요. 남은 후보는 모두가 먹을 수 있는 메뉴예요.",
              '그다음 3픽을 단체방에 공유하고 투표하면 "아무거나"가 오가는 시간이 크게 줄어요. 치킨, 피자, 고기구이, 중식 요리처럼 나눠 먹기 좋은 메뉴가 여럿일 때 특히 잘 맞아요.',
            ],
          },
          {
            heading: "동행 선택은 어떻게 쓰이나요?",
            body: [
              "지금은 동행을 골라도 추천 결과가 바뀌지는 않아요. 메뉴마다 1인분 주문이 되는지, 나눠 먹기 좋은지 같은 정보를 정리한 뒤 추천에 반영할 예정이에요.",
            ],
          },
        ],
      },
      en: {
        title: "Solo, for two, or a group: choosing by party size",
        description:
          "Tips for choosing a meal when you eat alone, as a pair or in a group, and how to collect opinions quickly.",
        sections: [
          {
            heading: "Eating alone",
            body: [
              "For a solo meal, what matters most is whether you can order a single portion. One-bowl or one-set dishes like gukbap, rice bowls, ramen, gimbap and burgers are easiest. Many Korean barbecue and hot pot places require at least two servings, so check in advance.",
              "When you're on your own, you don't have to worry about anyone else, which makes it a great time to try the dish in the Try something new slot.",
            ],
          },
          {
            heading: "Eating as a pair",
            body: [
              "For two people, ordering different dishes and sharing works well. Gollajuke's three picks come from different cuisines, so each of you can take one and save the third for next time.",
              "If either of you can't eat an ingredient, remove it under Leave out first. Then only dishes you can both eat will appear.",
            ],
          },
          {
            heading: "Eating in a group",
            body: [
              "With a group, the fastest approach is to collect everyone's restrictions first. Ask about ingredients people can't eat, cuisines they'd like to avoid and the budget per person, and enter all of it under Leave out. Every remaining dish is one everyone can eat.",
              'Then share the three picks in your group chat and vote. It dramatically cuts down the "anything is fine" back-and-forth, especially for shareable dishes like fried chicken, pizza, Korean barbecue and Chinese mains.',
            ],
          },
          {
            heading: "How is the company option used?",
            body: [
              "Right now, choosing your company doesn't change the picks. We plan to add information such as whether a dish can be ordered for one and whether it's good for sharing, and then use it in recommendations.",
            ],
          },
        ],
      },
      ja: {
        title: "ひとり・ふたり・大人数：人数別メニューの選び方",
        description:
          "ひとりで、ふたりで、大人数で食べるときのメニュー選びのコツと、意見を早くまとめる方法を紹介します。",
        sections: [
          {
            heading: "ひとりで食べるとき",
            body: [
              "ひとりごはんで一番大事なのは、1人前で注文できるかどうかです。クッパ、丼、ラーメン、キンパ、バーガーのように一杯・1セットで完結するメニューが楽です。焼肉や鍋は2人前からの店が多いので、ひとりなら事前に確認しておきましょう。",
              "ひとりのときは誰にも気をつかう必要がないので、「新しい挑戦」枠のメニューを試すのにもいい機会です。",
            ],
          },
          {
            heading: "ふたりで食べるとき",
            body: [
              "ふたりなら違うメニューを頼んで分け合うのがおすすめです。ゴラジュケの3品はそれぞれ違うジャンルなので、ふたりで1つずつ選び、残りの1つは次回の候補にとっておきましょう。",
              "どちらか一人でも食べられない食材があれば、「抜いてね」で先に外してください。ふたりとも食べられるメニューだけが出てきます。",
            ],
          },
          {
            heading: "大人数で食べるとき",
            body: [
              "大人数なら、まず全員の制約を集めるのが一番早いです。食べられない食材、避けたいジャンル、1人あたりの予算を一度に聞いて、すべて「抜いてね」に入れましょう。残った候補は全員が食べられるメニューです。",
              "そのあと3品をグループチャットで共有して投票すれば、「なんでもいい」のやりとりが大幅に減ります。チキン、ピザ、焼肉、中華料理のように取り分けやすいメニューが多いときに特に向いています。",
            ],
          },
          {
            heading: "同行者の選択はどう使われますか？",
            body: [
              "今のところ、同行者を選んでもおすすめ結果は変わりません。メニューごとに1人前で注文できるか、シェアしやすいかといった情報を整理してから、おすすめに反映する予定です。",
            ],
          },
        ],
      },
      zh: {
        title: "一个人、两个人、多人：按人数选菜",
        description:
          "介绍一个人、两个人和多人吃饭时的选菜技巧，以及快速统一意见的方法。",
        sections: [
          {
            heading: "一个人吃",
            body: [
              "一个人吃饭，最重要的是能不能点一人份。汤饭、盖饭、拉面、紫菜包饭、汉堡这类一碗或一套就能搞定的菜最方便。很多烤肉店和火锅店两人份起点，一个人的话最好提前确认。",
              "一个人的时候不用顾及别人，正是尝试“尝鲜挑战”栏里那道菜的好机会。",
            ],
          },
          {
            heading: "两个人吃",
            body: [
              "两个人的话，点不同的菜分着吃是不错的方法。Gollajuke 的 3 道菜来自不同类别，两人各选一道，剩下一道留作下次的候选。",
              "只要有一个人有不能吃的食材，就先在“帮我去掉”里去掉。这样只会出现两个人都能吃的菜。",
            ],
          },
          {
            heading: "多人吃",
            body: [
              "人多时，最快的方法是先收集每个人的限制。一次问清不能吃的食材、想避开的类别和人均预算，全部填进“帮我去掉”。剩下的候选都是大家都能吃的菜。",
              "然后把 3 道菜分享到群聊里投票，来回说“随便”的时间会大大减少。在炸鸡、披萨、烤肉、中餐这类适合分享的菜比较多时尤其好用。",
            ],
          },
          {
            heading: "同伴选项有什么用？",
            body: [
              "目前选择同伴不会改变推荐结果。我们计划先整理每道菜能否点一人份、是否适合分享等信息，然后再反映到推荐中。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "allergies",
    emoji: "🥜",
    text: {
      ko: {
        title: "알레르기나 식단 제한이 있을 때 메뉴 고르기",
        description:
          "못 먹는 재료가 있을 때 메뉴를 고르는 순서, 숨어 있기 쉬운 재료, 식당에서 확인할 것을 정리했습니다.",
        sections: [
          {
            heading: "먼저 빼고 시작하기",
            body: [
              "못 먹는 재료가 있다면 메뉴를 보기 전에 빼는 게 먼저예요. 골라주께의 빼주께에서 우유, 달걀, 밀, 대두, 땅콩·견과, 새우·게, 조개·오징어류, 생선, 돼지고기, 소고기, 닭고기 중 해당하는 걸 고르면, 그 재료가 들어간다고 표시된 메뉴는 아예 추천되지 않아요.",
              "종교나 식습관 때문에 특정 고기를 먹지 않는 경우에도 같은 방법으로 쓸 수 있어요.",
            ],
          },
          {
            heading: "숨어 있기 쉬운 재료",
            body: [
              "간장과 된장, 고추장에는 대두가 들어가고, 간장과 여러 소스에는 밀이 들어가는 경우가 많아요. 동남아 음식의 피시소스와 일식 육수의 가쓰오부시는 생선, 새우 페이스트는 갑각류예요. 짬뽕 국물이나 해장국처럼 겉으로 보이지 않는 육수 재료도 조심해야 해요.",
              "튀김옷과 빵가루에는 밀과 달걀, 크림 소스와 치즈에는 우유가 들어가요. 땅콩은 소스(탄탄면, 사테, 팟타이)나 고명으로 자주 쓰여요.",
            ],
          },
          {
            heading: "표시는 참고용이에요",
            body: [
              "골라주께의 재료 정보는 일반적인 조리법을 기준으로 정리한 참고 정보예요. 같은 이름의 메뉴라도 가게마다 쓰는 재료와 양념이 다르고, 같은 주방에서 조리하면서 섞일 수도 있어요.",
            ],
          },
          {
            heading: "식당에서 확인할 것",
            body: [
              "주문할 때 못 먹는 재료를 구체적으로 말하고, 양념과 육수에도 들어가는지 물어보세요. 심한 알레르기가 있다면 같은 기름이나 조리 도구를 쓰는지도 확인하는 게 좋아요. 의심스러울 때는 다른 메뉴를 고르는 게 가장 안전해요.",
            ],
          },
        ],
      },
      en: {
        title: "Choosing a meal with allergies or dietary restrictions",
        description:
          "How to choose when there are ingredients you can't eat, which ingredients tend to hide, and what to ask at the restaurant.",
        sections: [
          {
            heading: "Start by leaving things out",
            body: [
              "If there are ingredients you can't eat, remove them before looking at any dishes. Under Leave out in Gollajuke, select from milk, egg, wheat, soy, peanuts and nuts, shrimp and crab, shellfish and squid, fish, pork, beef and chicken. Dishes marked as containing them will never be recommended.",
              "This works the same way if you avoid certain meats for religious or personal reasons.",
            ],
          },
          {
            heading: "Ingredients that tend to hide",
            body: [
              "Soy sauce, doenjang and gochujang contain soy, and soy sauce and many other sauces often contain wheat. Fish sauce in Southeast Asian food and bonito flakes in Japanese broth are fish, and shrimp paste is a crustacean. Watch out for broths you can't see, like jjamppong soup or haejangguk.",
              "Batter and breadcrumbs contain wheat and egg, while cream sauces and cheese contain milk. Peanuts often appear in sauces (dandan noodles, satay, pad thai) or as toppings.",
            ],
          },
          {
            heading: "Our labels are for reference",
            body: [
              "Gollajuke's ingredient information is based on typical recipes and is for reference only. The same dish can use different ingredients and seasonings at each restaurant, and cross-contact can happen in a shared kitchen.",
            ],
          },
          {
            heading: "What to ask at the restaurant",
            body: [
              "When ordering, name the ingredients you can't eat and ask whether they're in the seasoning or broth too. If your allergy is severe, also ask whether they share frying oil or cooking tools. When in doubt, choosing another dish is the safest option.",
            ],
          },
        ],
      },
      ja: {
        title: "アレルギーや食事制限があるときのメニューの選び方",
        description:
          "食べられない食材があるときの選ぶ手順、隠れやすい食材、お店で確認することをまとめました。",
        sections: [
          {
            heading: "まず外してから始める",
            body: [
              "食べられない食材があるなら、メニューを見る前に外すのが先です。ゴラジュケの「抜いてね」で、乳、卵、小麦、大豆、落花生・ナッツ、エビ・カニ、貝・イカ、魚、豚肉、牛肉、鶏肉の中から該当するものを選ぶと、その食材が入っていると表示されたメニューはまったくおすすめされなくなります。",
              "宗教や食習慣で特定の肉を食べない場合も、同じ方法で使えます。",
            ],
          },
          {
            heading: "隠れやすい食材",
            body: [
              "醤油、テンジャン、コチュジャンには大豆が、醤油や多くのソースには小麦が入っていることが多いです。東南アジア料理のナンプラーや和食の出汁のかつお節は魚、エビペーストは甲殻類です。チャンポンのスープやヘジャンクッのように、見た目ではわからない出汁の材料にも注意が必要です。",
              "衣やパン粉には小麦と卵、クリームソースやチーズには乳が入っています。落花生はソース（担々麺、サテ、パッタイ）やトッピングによく使われます。",
            ],
          },
          {
            heading: "表示は参考情報です",
            body: [
              "ゴラジュケの食材情報は一般的なレシピをもとにした参考情報です。同じ名前のメニューでも店によって使う食材や調味料が異なり、同じ厨房で調理する際に混ざることもあります。",
            ],
          },
          {
            heading: "お店で確認すること",
            body: [
              "注文するときに食べられない食材を具体的に伝え、調味料や出汁にも入っているか聞きましょう。重いアレルギーがある場合は、同じ油や調理器具を使っていないかも確認するのがおすすめです。迷ったときは別のメニューを選ぶのが一番安全です。",
            ],
          },
        ],
      },
      zh: {
        title: "有过敏或饮食限制时如何选菜",
        description:
          "整理了有不能吃的食材时的选菜步骤、容易隐藏的食材，以及在餐厅需要确认的事项。",
        sections: [
          {
            heading: "先去掉再开始",
            body: [
              "如果有不能吃的食材，看菜之前先去掉。在 Gollajuke 的“帮我去掉”里，从牛奶、鸡蛋、小麦、大豆、花生·坚果、虾·蟹、贝类·鱿鱼、鱼、猪肉、牛肉、鸡肉中选择对应的，标注含有这些食材的菜就完全不会被推荐。",
              "因宗教或饮食习惯不吃某些肉类时，也可以用同样的方法。",
            ],
          },
          {
            heading: "容易隐藏的食材",
            body: [
              "酱油、大酱、辣椒酱含大豆，酱油和很多酱料常含小麦。东南亚菜的鱼露和日料高汤里的鲣鱼片属于鱼类，虾酱属于甲壳类。炒码面汤、醒酒汤这类看不出来的汤底食材也要注意。",
              "面衣和面包糠含小麦和鸡蛋，奶油酱和奶酪含牛奶。花生常用于酱料（担担面、沙爹、泰式炒河粉）或作为配料。",
            ],
          },
          {
            heading: "标注仅供参考",
            body: [
              "Gollajuke 的食材信息基于常见做法整理，仅供参考。同名的菜在不同店铺所用食材和调料可能不同，在同一厨房烹饪时也可能交叉接触。",
            ],
          },
          {
            heading: "在餐厅要确认的事",
            body: [
              "点菜时具体说出不能吃的食材，并询问调料和汤底里是否也有。如果过敏严重，最好也确认是否共用炸油或厨具。拿不准时，选别的菜最安全。",
            ],
          },
        ],
      },
    },
  },
];

export const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));
