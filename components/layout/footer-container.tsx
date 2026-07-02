import Link from 'next/link';

export function FooterContainer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <nav aria-label="푸터 네비게이션">
          <h2 className="sr-only">푸터 메뉴</h2>
          <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            <span className="font-semibold text-foreground">탐색</span>
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <li>
                <Link href="/posts" className="text-muted-foreground transition-colors hover:text-foreground">
                  포스트
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-muted-foreground transition-colors hover:text-foreground">
                  태그별 보기
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-muted-foreground transition-colors hover:text-foreground">
                  기업별 보기
                </Link>
              </li>
              <li>
                <Link href="/digest" className="text-muted-foreground transition-colors hover:text-foreground">
                  주간 인기글
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            <span className="font-semibold text-foreground">정보</span>
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {/* <li>
                <a
                  href="https://github.com/jm4293/dev-blog"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li> */}
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground transition-colors hover:text-foreground">
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
          <p>&copy; 2026 devBlog.kr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
