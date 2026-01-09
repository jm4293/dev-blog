import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | DevBlog',
  description: 'DevBlog의 이용약관을 확인하세요.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">이용약관</h1>
          <p className="text-lg text-gray-600">DevBlog 서비스 이용약관입니다.</p>
          <p className="text-sm text-gray-500 mt-2">최종 수정일: 2026년 1월 10일</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700">
              이 약관은 DevBlog(이하 &quot;서비스&quot;)가 제공하는 서비스의 이용조건 및 절차, 이용자와 서비스 제공자의
              권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제2조 (용어의 정의)</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                &quot;서비스&quot;란 DevBlog가 제공하는 한국 개발 기업들의 기술 블로그 콘텐츠를 모아보는 플랫폼을
                말합니다.
              </li>
              <li>
                &quot;이용자&quot;란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.
              </li>
              <li>
                &quot;회원&quot;이란 서비스에 회원등록을 한 자로서, 계속적으로 서비스를 이용할 수 있는 자를 말합니다.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력과 변경)</h2>
            <p className="text-gray-700 mb-4">
              ① 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
            </p>
            <p className="text-gray-700 mb-4">
              ② 서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.
            </p>
            <p className="text-gray-700">
              ③ 약관이 변경되는 경우에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자
              7일 이전부터 적용일자 전일까지 공지합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공)</h2>
            <p className="text-gray-700 mb-4">① 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</p>
            <p className="text-gray-700">
              ② 서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는 서비스의
              제공을 일시적으로 중단할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제5조 (회원가입)</h2>
            <p className="text-gray-700 mb-4">
              ① 이용자는 서비스가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서
              회원가입을 신청합니다.
            </p>
            <p className="text-gray-700">
              ② 서비스는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로
              등록합니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
              <li>기타 회원으로 등록하는 것이 서비스의 기술상 현저히 지장이 있다고 판단되는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제6조 (회원 탈퇴 및 자격 상실)</h2>
            <p className="text-gray-700 mb-4">
              ① 회원은 언제든지 서비스에 탈퇴를 요청할 수 있으며 서비스는 즉시 회원탈퇴를 처리합니다.
            </p>
            <p className="text-gray-700">
              ② 회원이 다음 각 호의 사유에 해당하는 경우, 서비스는 회원자격을 제한 및 정지시킬 수 있습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>가입 신청 시에 허위 내용을 등록한 경우</li>
              <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
              <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제7조 (개인정보보호)</h2>
            <p className="text-gray-700">
              ① 서비스는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
            </p>
            <p className="text-gray-700">
              ② 서비스는 회원의 개인정보를 「개인정보 보호법」 등 관계 법령이 정하는 바에 따라 보호하기 위해 노력합니다.
              개인정보의 보호 및 사용에 대해서는 관련법 및 서비스의 개인정보 처리방침이 적용됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제8조 (서비스의 중단)</h2>
            <p className="text-gray-700">
              ① 서비스는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는
              서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
            <p className="text-gray-700">
              ② 제1항에 의한 서비스 중단의 경우 서비스는 제11조에 정한 방법으로 이용자에게 통지합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제9조 (저작권의 귀속 및 이용제한)</h2>
            <p className="text-gray-700">
              ① 서비스가 작성한 저작물에 대한 저작권 기타 지적재산권은 서비스에 귀속합니다.
            </p>
            <p className="text-gray-700">
              ② 이용자는 서비스를 이용함으로써 얻은 정보 중 서비스에게 지적재산권이 귀속된 정보를 서비스의 사전 승낙
              없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는
              안됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제10조 (면책조항)</h2>
            <p className="text-gray-700 mb-4">
              ① 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에
              관한 책임이 면제됩니다.
            </p>
            <p className="text-gray-700">
              ② 서비스는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
            </p>
            <p className="text-gray-700">
              ③ 서비스는 이용자가 서비스와 링크된 외부 사이트와의 거래를 함에 있어 발생하는 손해에 대해서는 책임을 지지
              않습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제11조 (관할법원)</h2>
            <p className="text-gray-700">
              서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 관할 법원은 민사소송법에 따라 정합니다.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">이 약관은 2026년 1월 10일부터 시행됩니다.</p>
        </div>
      </div>
    </div>
  );
}
