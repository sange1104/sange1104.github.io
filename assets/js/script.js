// js/script.js 파일
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('project-list');

  // HTML 리스트(<ul><li>)를 생성하는 헬퍼 함수
  const createListHtml = (items) => {
    if (!items || items.length === 0) return '';
    const listItems = items.map(item => `<li>${item}</li>`).join('');
    return `<ul>${listItems}</ul>`;
  };
  
  // HTML 제목과 내용을 렌더링하는 헬퍼 함수
  const renderSection = (title, data) => {
      // 데이터가 없거나 비어 있으면 섹션 자체를 렌더링하지 않음
      if (!data || data.length === 0) return '';
      
      return `
          <h3><b>${title}</b></h3>
          ${createListHtml(data)}
      `;
  };

  projectData.forEach(project => {
    // 1. 각 섹션별 HTML 생성
    const goalSection = renderSection('Goal', project.goal);
    const roleSection = renderSection('Role', project.role);
    const resultsSection = renderSection('Results', project.results);
    const techStackSection = renderSection('Tech Stack', project.techStack);
    
    // 2. 전체 <details> 블록 HTML 생성 (템플릿 리터럴 사용)
    const projectHtml = `
      <details>
        <summary>
          <strong> ${project.title}</strong>
        </summary>
        <div class="project-details">
          ${goalSection}
          ${roleSection}
          ${resultsSection}
          ${techStackSection}
        </div>
      </details>
    `;

    // 3. 생성된 HTML을 컨테이너에 추가
    container.insertAdjacentHTML('beforeend', projectHtml);
  });
});