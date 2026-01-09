import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침 | DevBlog',
  description: 'DevBlog의 개인정보 처리방침을 확인하세요.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">개인정보 처리방침</h1>
          <p className="text-lg text-gray-600">
            DevBlog는 이용자의 개인정보를 중요하게 생각하며, 개인정보 보호법을 준수합니다.
          </p>
          <p className="text-sm text-gray-500 mt-2">최종 수정일: 2026년 1월 10일</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-gray-700 mb-4">
              DevBlog는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
              이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한
              조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>회원 가입 및 관리: 회원제 서비스 이용에 따른 본인 확인, 개인 식별, 불량회원의 부정 이용 방지</li>
              <li>서비스 제공: 북마크 저장, 개인화된 콘텐츠 추천</li>
              <li>고객 문의 응대: 문의사항 처리 및 답변 제공</li>
              <li>서비스 개선: 서비스 이용 통계 분석 및 개선</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 수집하는 개인정보의 항목</h2>
            <p className="text-gray-700 mb-4">
              DevBlog는 회원가입, 서비스 이용 과정에서 아래와 같은 개인정보를 수집합니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">필수 항목</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>이메일 주소</li>
                <li>서비스 이용 기록 (접속 로그, 쿠키 등)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">선택 항목</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>프로필 이미지</li>
                <li>관심 기술 분야</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-gray-700 mb-4">
              DevBlog는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
              보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>회원 가입 정보: 회원 탈퇴 시까지</li>
              <li>서비스 이용 기록: 1년</li>
              <li>문의 및 불만 처리 기록: 1년</li>
            </ul>
            <p className="text-gray-700 mt-4">
              다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지 보유합니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우</li>
              <li>홈페이지 이용에 따른 채권·채무관계 잔존 시</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 개인정보의 파기 절차 및 방법</h2>
            <p className="text-gray-700 mb-4">
              DevBlog는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당
              개인정보를 파기합니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">파기 절차</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>개인정보 보유기간 경과 또는 처리목적 달성 시</li>
                <li>정보주체의 파기 요청 시</li>
                <li>서비스 종료 또는 사업 양도·합병 시</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">파기 방법</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제</li>
                <li>기록물, 인쇄물 등: 분쇄 또는 소각</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 개인정보의 제3자 제공</h2>
            <p className="text-gray-700 mb-4">
              DevBlog는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
              </li>
              <li>
                통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는 형태로 제공하는
                경우
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 개인정보 처리 위탁</h2>
            <p className="text-gray-700 mb-4">
              DevBlog는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">수탁업체</th>
                    <th className="text-left py-2">위탁 업무 내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Supabase Inc.</td>
                    <td className="py-2">데이터베이스 호스팅 및 사용자 인증 서비스</td>
                  </tr>
                  <tr>
                    <td className="py-2">Vercel Inc.</td>
                    <td className="py-2">웹 호스팅 및 CDN 서비스</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 이용자의 권리와 행사 방법</h2>
            <p className="text-gray-700 mb-4">이용자는 언제든지 다음의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>개인정보 열람 요구: 처리하고 있는 개인정보의 열람을 요구할 수 있습니다</li>
              <li>개인정보 정정·삭제 요구: 개인정보의 정정 또는 삭제를 요구할 수 있습니다</li>
              <li>개인정보 처리정지 요구: 개인정보의 처리정지를 요구할 수 있습니다</li>
              <li>동의 철회: 개인정보 수집·이용·제공에 대한 동의를 철회할 수 있습니다</li>
            </ul>
            <p className="text-gray-700 mt-4">
              권리 행사는 개인정보 보호책임자에게 서면, 전화, 이메일 등을 통해 하실 수 있으며, DevBlog는 이에 대해
              지체없이 조치하겠습니다. 이용자의 권리 행사에 따른 본인 확인 절차를 거친 후 10일 이내에 처리 결과를
              통지하겠습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 개인정보 보호를 위한 조치</h2>
            <p className="text-gray-700 mb-4">
              DevBlog는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 개인정보 보호 교육, 개인정보 처리자 지정 및 관리</li>
              <li>
                기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 개인정보의 암호화, 보안프로그램
                설치
              </li>
              <li>물리적 조치: 개인정보가 저장된 시설에 대한 물리적 접근통제, 자료보관실 등의 접근통제</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 개인정보 보호책임자</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                DevBlog는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및
                피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="mt-4">
                <p className="font-semibold">개인정보 보호책임자</p>
                <p>성명: 이재민</p>
                <p>직책: 개인 개발자 (비상업적 용도)</p>
                <p>연락처: dlwoals4293@gmail.com</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 개인정보 유출 등 사고 발생 시 조치</h2>
            <p className="text-gray-700 mb-4">
              개인정보 유출 등 사고 발생 시 개인정보 보호법 제34조에 따라 다음과 같이 조치하겠습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>개인정보 보호위원회 신고: 유출 사고 발생 후 72시간 이내 신고</li>
              <li>이용자 통지: 유출된 개인정보의 항목, 유출 시점, 조치 내용 등을 지체없이 통지</li>
              <li>피해 구제 조치: 이용자의 피해를 최소화하기 위한 조치를 취하겠습니다</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. 개인정보 침해 신고</h2>
            <p className="text-gray-700 mb-4">
              개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
              <li>대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-3573)</li>
              <li>경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. 개인정보 처리방침 변경</h2>
            <p className="text-gray-700">
              이 개인정보 처리방침은 2026년 1월 10일부터 적용됩니다. 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이
              있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">이 방침은 2026년 1월 10일부터 시행됩니다.</p>
        </div>
      </div>
    </div>
  );
}
