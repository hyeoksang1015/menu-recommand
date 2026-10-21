import { site } from "@/config/site";

// Google 태그(gtag.js). Google이 준 코드 그대로, 각 페이지 <head>에 한 번만 넣는다(RootShell, 전역 404).
export default function GoogleTag() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${site.gaId}');`,
        }}
      />
    </>
  );
}
