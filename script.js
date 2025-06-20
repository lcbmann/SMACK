const quizContainer = document.getElementById("quiz-container");

function renderIntro() {
  quizContainer.innerHTML = `
    <section class="max-w-4xl mx-auto text-center px-4 sm:px-8">
      <img 
        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
        alt="Concert" 
        class="rounded-3xl shadow-2xl mb-12 w-full h-64 object-cover"
      />
      <h2 class="text-4xl sm:text-5xl font-bold mb-6 tracking-tight leading-tight">
        What Kind of Concertgoer Are You?
      </h2>
      <p class="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
        Discover your musical personality and get personalized concert recommendations from our upcoming season.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-16 text-left">
        <div class="bg-gray-100 rounded-2xl p-6 shadow hover:shadow-md transition">
          <div class="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-clock text-black text-lg"></i>
          </div>
          <h3 class="text-xl font-semibold mb-1">Quick & Precise</h3>
          <p class="text-sm text-gray-600">8 questions in 2 minutes for your perfect concert match</p>
        </div>
        <div class="bg-gray-100 rounded-2xl p-6 shadow hover:shadow-md transition">
          <div class="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-music text-black text-lg"></i>
          </div>
          <h3 class="text-xl font-semibold mb-1">Curated</h3>
          <p class="text-sm text-gray-600">Personalized picks from our concert program</p>
        </div>
      </div>

      <button onclick="startQuiz()" class="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold text-lg py-4 px-10 rounded-2xl shadow-lg transition transform hover:scale-105">
        Start Quiz
      </button>
    </section>
  `;
}

function startQuiz() {
  renderQuestion(0);
}

const questions = [
  {
    id: "q1",
    text: "How are you feeling today?",
    options: [
      { value: "energetic", text: "Energetic & Ready for Adventure", description: "I want something exciting and dynamic", icon: "fas fa-bolt" },
      { value: "peaceful", text: "Contemplative & Peaceful", description: "I need something soothing and reflective", icon: "fas fa-leaf" },
      { value: "emotional", text: "Emotional & Passionate", description: "I want to feel deeply moved", icon: "fas fa-heart" },
      { value: "social", text: "Social & Celebratory", description: "I want to share a special experience", icon: "fas fa-users" }
    ]
  }
];

let answers = {};
let currentIndex = 0;

function renderQuestion(index) {
  const question = questions[index];
  if (!question) return renderResults();

  quizContainer.innerHTML = `
    <div class="max-w-3xl mx-auto">
      <div class="mb-6 flex justify-between text-sm text-gray-500 uppercase tracking-wide">
        <span>Question ${index + 1} of ${questions.length}</span>
        <span>${Math.round(((index + 1) / questions.length) * 100)}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-1 mb-10">
        <div class="bg-yellow-400 h-1 rounded-full transition-all duration-500 ease-out" style="width: ${((index + 1) / questions.length) * 100}%"></div>
      </div>
      <h3 class="text-3xl font-bold text-center mb-10">${question.text}</h3>
      <div class="space-y-4">
        ${question.options.map(opt => {
          const selected = answers[question.id] === opt.value;
          return `
            <button onclick="selectAnswer('${question.id}', '${opt.value}', ${index})"
              class="w-full text-left card ${selected ? 'card-selected' : ''}">
              <div class="flex items-start space-x-4">
                <div class="card-icon ${selected ? 'bg-yellow-300' : 'bg-black/10'}">
                  <i class="${opt.icon} text-lg ${selected ? 'text-black' : 'text-gray-700'}"></i>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">${opt.text}</h4>
                  <p class="text-sm text-gray-600">${opt.description}</p>
                </div>
              </div>
            </button>
          `;
        }).join("")}
      </div>
      <div class="flex justify-between mt-10">
        <button onclick="goBack()" class="btn btn-secondary ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${index === 0 ? 'disabled' : ''}>← Back</button>
        <button onclick="goNext(${index})" class="btn btn-yellow ${answers[question.id] ? '' : 'opacity-30 cursor-not-allowed'}" ${answers[question.id] ? '' : 'disabled'}>
          Next →
        </button>
      </div>
    </div>
  `;
}

function selectAnswer(questionId, value, index) {
  answers[questionId] = value;
  renderQuestion(index);
}

function goBack() {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion(currentIndex);
  }
}

function goNext(index) {
  if (!answers[questions[index].id]) return;
  currentIndex = index + 1;
  if (currentIndex < questions.length) {
    renderQuestion(currentIndex);
  } else {
    renderResults();
  }
}

function renderResults() {
  quizContainer.innerHTML = `
    <div class="max-w-xl mx-auto text-center">
      <h2 class="text-4xl font-bold mb-6">Your Result</h2>
      <p class="text-lg text-gray-700 mb-8">Thanks for taking the quiz!</p>
      <button onclick="restartQuiz()" class="btn btn-secondary">
        Retake Quiz
      </button>
    </div>
  `;
}

function restartQuiz() {
  answers = {};
  currentIndex = 0;
  renderIntro();
}

renderIntro();