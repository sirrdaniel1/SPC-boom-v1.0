const gradeButtons = [...document.querySelectorAll(".filter-chip")];
const subjectButtons = [...document.querySelectorAll(".subject-filter")];
const lessonCards = [...document.querySelectorAll(".lesson-card")];
const searchInput = document.querySelector("#lesson-search");
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector("#empty-state");
const lessonDialog = document.querySelector(".lesson-dialog");
const dialogBackdrop = document.querySelector(".dialog-backdrop");
const dialogTitle = document.querySelector("#dialog-title");
const dialogMeta = document.querySelector("#dialog-meta");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

let activeGrade = "all";
let activeSubject = "all";

function updateLessons() {
  if (!lessonCards.length || !searchInput) return;

  const query = searchInput.value.trim().toLocaleLowerCase();
  let count = 0;

  for (const card of lessonCards) {
    const matchesGrade = activeGrade === "all" || card.dataset.grade === activeGrade;
    const matchesSubject = activeSubject === "all" || card.dataset.subject === activeSubject;
    const searchableText = `${card.dataset.title} ${card.dataset.subject} ${card.dataset.grade}`.toLocaleLowerCase();
    const isVisible = matchesGrade && matchesSubject && searchableText.includes(query);

    card.hidden = !isVisible;
    if (isVisible) count += 1;
  }

  if (visibleCount) visibleCount.textContent = String(count);
  if (emptyState) emptyState.hidden = count !== 0;
}

for (const button of gradeButtons) {
  button.addEventListener("click", () => {
    activeGrade = button.dataset.grade;
    for (const gradeButton of gradeButtons) {
      const isActive = gradeButton === button;
      gradeButton.classList.toggle("is-active", isActive);
      gradeButton.setAttribute("aria-pressed", String(isActive));
    }
    updateLessons();
  });
}

for (const button of subjectButtons) {
  button.addEventListener("click", () => {
    activeSubject = button.dataset.subject;
    for (const subjectButton of subjectButtons) {
      const isActive = subjectButton === button;
      subjectButton.classList.toggle("is-active", isActive);
      subjectButton.setAttribute("aria-pressed", String(isActive));
    }
    updateLessons();
  });
}

if (searchInput) searchInput.addEventListener("input", updateLessons);

document.querySelector(".reset-filters")?.addEventListener("click", () => {
  activeGrade = "all";
  activeSubject = "all";
  searchInput.value = "";

  for (const button of [...gradeButtons, ...subjectButtons]) {
    const isActive = button.dataset.grade === "all" || button.dataset.subject === "all";
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
  updateLessons();
});

function setDialogContent(title, meta, message, hint) {
  if (!lessonDialog) return;
  if (dialogTitle) dialogTitle.textContent = title;
  if (dialogMeta) dialogMeta.textContent = meta;
  const dialogMessage = document.querySelector(".dialog-message");
  const dialogHint = document.querySelector(".dialog-hint");
  if (dialogMessage) dialogMessage.textContent = message;
  if (dialogHint) dialogHint.textContent = hint;
  lessonDialog.showModal();
  dialogBackdrop?.classList.add("is-visible");
  document.body.classList.add("dialog-open");
}

function closeLessonDialog() {
  if (lessonDialog?.open) lessonDialog.close();
  dialogBackdrop?.classList.remove("is-visible");
  document.body.classList.remove("dialog-open");
}

for (const card of lessonCards) {
  card.querySelector(".lesson-open")?.addEventListener("click", () => {
    const gradeLabels = { "3e": "3e", "2nde": "SECONDE", "1ere": "PREMIÈRE", "terminale": "TERMINALE" };
    setDialogContent(
      card.dataset.title,
      `${gradeLabels[card.dataset.grade]} · ${card.dataset.subject.toUpperCase()}`,
      "Le cours vidéo de Dr. Diaa Megahed sera bientôt disponible.",
      "Le contenu est intégré dans cette bibliothèque de cours."
    );
  });
}

for (const button of document.querySelectorAll(".exercise-open")) {
  button.addEventListener("click", () => {
    setDialogContent(
      button.dataset.exercise,
      "BANQUE D’EXERCICES",
      "Les exercices seront bientôt disponibles dans cette section.",
      "Chaque série pourra inclure le corrigé détaillé et des explications."
    );
  });
}

document.querySelector(".private-open")?.addEventListener("click", () => {
  setDialogContent(
    "Cours particuliers",
    "ACCOMPAGNEMENT PERSONNALISÉ",
    "Présentez le niveau de l’élève, les difficultés rencontrées et les objectifs souhaités.",
    "Un formulaire de demande pourra être ajouté avec vos coordonnées."
  );
});

if (lessonDialog) {
  lessonDialog.addEventListener("close", closeLessonDialog);
  document.querySelector(".dialog-done")?.addEventListener("click", closeLessonDialog);
  document.querySelector(".dialog-close")?.addEventListener("click", closeLessonDialog);
  dialogBackdrop?.addEventListener("click", closeLessonDialog);
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Ouvrir la navigation" : "Fermer la navigation");
    navigation.classList.toggle("is-open", !isExpanded);
  });

  for (const link of navigation.querySelectorAll("a")) {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir la navigation");
      navigation.classList.remove("is-open");
    });
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && searchInput && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    searchInput.focus();
  }
});
