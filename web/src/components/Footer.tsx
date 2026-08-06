export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-fg-subtle sm:px-6">
        <p>MassVector | 주가 예측 서비스 (프로토타입)</p>
        <p>
          본 서비스에 표시되는 시세, 차트, 예측 정보는 실제 데이터가 아닌 화면
          구성을 위한 예시이며, 투자 판단의 근거로 사용할 수 없습니다.
        </p>
      </div>
    </footer>
  );
}
