import { Metadata } from 'next';
import { APP } from '@/utils/constants';

export const metadata: Metadata = {
  title: '이용약관 - devBlog.kr',
  description: 'devBlog.kr의 이용약관을 확인하세요. 서비스 이용 시 준수해야 할 규정을 안내합니다.',
  alternates: {
    canonical: `${APP.URL}/terms`,
  },
  openGraph: {
    title: '이용약관 - devBlog.kr',
    description: 'devBlog.kr의 이용약관을 확인하세요. 서비스 이용 시 준수해야 할 규정을 안내합니다.',
    url: `${APP.URL}/terms`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '이용약관 - devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '이용약관 - devBlog.kr',
    description: 'devBlog.kr의 이용약관을 확인하세요.',
    images: [`${APP.URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">이용약관</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">devBlog 서비스 이용약관입니다.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">최종 수정일: 2026년 1월 14일</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제1조 (목적)</h2>
            <p>
              이 약관은 devBlog(이하 &quot;서비스&quot;)가 제공하는 서비스의 이용조건 및 절차, 이용자와 서비스 제공자의
              권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제2조 (용어의 정의)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                &quot;서비스&quot;란 devBlog가 제공하는 개발 블로그 게시글을 수집하고, 태그 및 검색 기능을 통해
                사용자에게 제공하는 플랫폼을 말합니다.
              </li>
              <li>
                &quot;이용자&quot;란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 개인(회원 및 비회원)을 말합니다.
              </li>
              <li>
                &quot;회원&quot;이란 GitHub OAuth를 통해 서비스에 가입한 이용자로서, 즐겨찾기 등 회원 전용 기능을 이용할
                수 있는 자를 말합니다.
              </li>
              <li>
                &quot;콘텐츠&quot;란 각 기업 블로그에서 제공하는 개발 블로그 게시글, 제목, 설명 등 모든 정보를 말합니다.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제3조 (약관의 효력과 변경)</h2>
            <p className="mb-4">① 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</p>
            <p className="mb-4">
              ② 서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.
            </p>
            <p>
              ③ 약관이 변경되는 경우에는 적용일자 및 변경사유를 명시하여 서비스 웹사이트에 그 적용일자 7일 이전부터
              적용일자 전일까지 공지합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제4조 (서비스의 제공)</h2>
            <p className="mb-4">
              ① 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 단, 정기 점검 시간에는 서비스가 일시적으로
              중단될 수 있습니다.
            </p>
            <p>
              ② 서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는 서비스의
              제공을 일시적으로 중단할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제5조 (회원가입)</h2>
            <p className="mb-4">
              ① 회원가입은 GitHub OAuth를 통해 진행되며, 사용자의 GitHub 계정 정보로 자동 인증됩니다.
            </p>
            <p>② 서비스는 다음 각 호에 해당하지 않는 한 회원 가입을 승인합니다:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>GitHub 계정이 부정한 목적으로 생성된 것으로 판단되는 경우</li>
              <li>회원 가입이 서비스의 개발상 현저히 지장을 줄 수 있다고 판단되는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              제6조 (회원 탈퇴 및 자격 상실)
            </h2>
            <p className="mb-4">
              ① 회원은 언제든지 서비스 내 프로필 설정에서 탈퇴를 요청할 수 있으며 서비스는 즉시 회원탈퇴를 처리합니다.
            </p>
            <p className="mb-4">
              ② 회원이 다음 각 호의 사유에 해당하는 경우, 서비스는 회원자격을 제한 및 정지시킬 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
              <li>타 이용자의 서비스 이용을 방해하는 행위를 하는 경우</li>
              <li>기타 서비스 운영에 심각한 지장을 초래하는 행위를 하는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제7조 (이용자의 의무)</h2>
            <p className="mb-4">이용자는 다음 행위를 하여서는 안 됩니다:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>개발 블로그 콘텐츠의 무단 복제, 배포, 전송 또는 편집</li>
              <li>서비스 운영을 방해하거나 정상적인 기능을 저해하는 행위</li>
              <li>서비스를 통해 얻은 정보를 상업적 목적으로 이용하는 행위</li>
              <li>타 이용자의 개인정보를 수집 또는 이용하는 행위</li>
              <li>법령이나 공서양속에 반하는 행위</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              제8조 (서비스 콘텐츠의 저작권)
            </h2>
            <p className="mb-4">
              ① devBlog가 제공하는 콘텐츠(개발 블로그 게시글 포함)는 각 기업의 저작물입니다. 해당 콘텐츠의 저작권은 각
              기업에 귀속됩니다.
            </p>
            <p className="mb-4">
              ② devBlog가 작성한 서비스 관련 저작물(UI, 검색 기능, 태그 시스템 등)에 대한 저작권 및 지적재산권은
              devBlog에 귀속됩니다.
            </p>
            <p>
              ③ 이용자는 서비스를 통해 얻은 콘텐츠를 서비스의 사전 승낙 없이 복제, 배포, 전송, 편집, 영리목적으로 이용할
              수 없습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제9조 (면책조항)</h2>
            <p className="mb-4">
              ① 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에
              관한 책임이 면제됩니다.
            </p>
            <p className="mb-4">
              ② 서비스는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
            </p>
            <p className="mb-4">
              ③ 서비스는 이용자가 외부 기업의 개발 블로그를 이용함에 있어 발생하는 손해에 대해서는 책임을 지지 않습니다.
            </p>
            <p>
              ④ 서비스는 수집된 콘텐츠의 정확성, 완전성, 신뢰성 등에 대해 명시적 또는 묵시적 보증을 제공하지 않습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제10조 (개인정보보호)</h2>
            <p className="mb-4">
              ① 서비스는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
            </p>
            <p>
              ② 서비스는 회원의 개인정보를 &quot;개인정보 보호법&quot; 등 관계 법령이 정하는 바에 따라 보호하기 위해
              노력합니다. 개인정보의 보호 및 사용에 대해서는 서비스의 개인정보 처리방침이 적용됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제11조 (요청 및 문의)</h2>
            <p>
              이용자는 서비스 내 &quot;요청하기&quot; 페이지를 통해 새로운 기업 블로그 추가, 태그 추가 등의 요청을 할 수
              있습니다. 모든 요청은 검토 후 승인 여부가 결정되며, 통상적으로 3-5일 내에 처리됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">제12조 (분쟁해결)</h2>
            <p>서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 관할 법원은 민사소송법에 따라 정합니다.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              제13조 (서비스 이용 약관 동의)
            </h2>
            <p>이용자가 서비스를 이용함으로써 본 약관의 내용을 모두 읽었으며 이에 동의하는 것으로 간주됩니다.</p>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p>이 약관은 2026년 1월 14일부터 시행됩니다.</p>
        </div>
      </div>
    </div>
  );
}
