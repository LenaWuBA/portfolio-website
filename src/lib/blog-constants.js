export const TITLE_MAX_LENGTH = 150;
export const CONTENT_MAX_LENGTH = 20000;

export function validateBlogFields(title, content) {
  const errors = {};

  if (!title) {
    errors.title = "Please enter a title.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!content) {
    errors.content = "Please enter some content.";
  } else if (content.length > CONTENT_MAX_LENGTH) {
    errors.content = `Content must be ${CONTENT_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}
