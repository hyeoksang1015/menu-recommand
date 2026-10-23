import { site } from "@/config/site";

// Microsoft Clarity 태그. Clarity가 준 코드 그대로, 각 페이지 <head>에 한 번만 넣는다(RootShell, 전역 404).
// 이 사이트 주소에는 개인 정보가 없어 모든 페이지에 넣는다. 못 먹는 재료(알레르기) 선택은 InputPanel에서 녹화를 가린다.
export default function ClarityTag() {
  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${site.clarityId}");`,
      }}
    />
  );
}
