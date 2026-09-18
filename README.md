# Learn Hub

## Digital Educational Library Platform for Secondary Schools in Malawi

Learn Hub is a digital educational library platform designed to improve access to organized learning and teaching resources for secondary schools in Malawi. The platform allows verified schools and teachers to publish educational materials while students and teachers can discover, read, save, download, and discuss resources.

The platform focuses on books, past examination papers, subject notes, pamphlets, revision guides, and educational video tutorials. It also provides school profiles, personalized recommendations, personal libraries, school updates, and student questions linked to learning resources.

---

## Project Purpose

Many students and teachers have limited access to quality learning materials. Textbooks may be insufficient, outdated, or unevenly distributed, while past examination papers, revision notes, and teaching resources may be difficult to locate.

Learn Hub addresses this challenge by providing a centralized digital library where approved educational materials can be organized according to subject, department, class, school, publisher, and resource type.

---

## Main Features

### Digital library

- Digital books.
- Past examination papers.
- Subject notes.
- Pamphlets.
- Revision guides.
- School publications.
- Teacher explanations.
- Video tutorials.

### Account types

- Students.
- Teachers.
- Schools or organizations.
- Platform administrators.

### Student features

- Register with a school.
- Select a class or Form.
- Select one or more departments optionally.
- Search for learning materials.
- Add resources to a personal library.
- Create personal collections.
- Download approved resources for offline use.
- Ask questions about books and other materials.
- Like questions and answers.
- Follow school profiles.
- Receive school and resource notifications.
- Receive personalized recommendations.

### Teacher features

- Register with an approved school.
- Select a department and subjects taught.
- Publish past papers.
- Publish subject notes.
- Publish video tutorials.
- Answer student questions.
- Answer questions related to books.
- Mark answers correct where authorized.
- Follow school profiles.

### School features

- Create a verified school profile.
- Upload a school logo.
- Upload a campus cover image.
- Publish books.
- Publish official school learning materials.
- Publish past papers and pamphlets.
- Publish revision packages.
- Publish school announcements.
- Manage approved school members.
- Receive questions about school-published books.

### Discovery and recommendations

- Search by title, author, subject, department, class, school, resource type, language, and year.
- Browse books, papers, questions, feed activity, and schools.
- Receive recommendations based on department, class, school, subjects, and user activity.
- View new uploads from the user’s school.
- Follow schools and receive selected updates.
- Save searches and receive notifications about matching resources.

### Personal library

- Saved books and resources.
- Downloaded materials.
- Personal collections.
- Completed resources.
- Saved videos.
- Reading activity.
- Resource history.

### Questions and answers

Students can ask questions from a book or resource detail page. The question can include the book, subject, class, chapter, page number, and selected text where available.

A question card follows this format:

```text
[Profile Image] James Mike
Lilongwe Secondary School · Student · Form 3

How does photosynthesis produce glucose?

Biology · Science Department
3 answers · 12 likes
```

The publisher receives a notification when a question is posted about a published resource. Teachers and other permitted users can answer, while authorized teachers and heads of department can mark answers as correct.

---

## Main Navigation

```text
Home | Library | Discover | Notifications | Profile
```

### Home

The Home page shows:

- Recommended books and papers.
- Continue reading or recently used resources.
- Latest uploads from the user’s school.
- New resources from followed schools.
- Popular and recently added materials.

### Library

The Library contains the user’s saved and downloaded resources, collections, completed materials, and activity history.

### Discover

Questions and feed activity are included inside Discover.

```text
All | Books | Papers | Questions | Feed | Schools
```

### Notifications

Notifications include school uploads, new resources, answers, correct-answer confirmations, saved-search matches, and updates from followed schools.

### Profile

The Profile page contains personal information, school membership, department information, notification settings, account settings, and Publisher Studio where applicable.

---

## Publishing Rules

| Account type | Books | Past papers | Notes | Videos | Questions |
|---|---:|---:|---:|---:|---:|
| School | Yes | Yes | Yes | Yes | No |
| Teacher | No | Yes | Yes | Yes | Answers |
| Student | No | No | No | No | Yes |
| Administrator | Yes | Yes | Yes | Yes | Moderation |

### Publisher identity

Every resource displays its publisher.

School-published resource:

```text
Published by:
Lilongwe Secondary School
Verified school publisher
```

Teacher-published resource:

```text
Published by:
Peter Banda
Teacher · Science Department
Lilongwe Secondary School
```

---

## Registration and Verification

### Student registration

Students provide:

- Full name.
- Class or Form.
- Optional department selection.
- School.
- Registration number where required.
- Email address.
- Phone number.
- Password.

### Teacher registration

Teachers provide:

- Full name.
- School.
- Department.
- Subjects taught.
- Staff number where applicable.
- Email address.
- Phone number.
- Password.

### School registration

Schools provide:

- Institution name.
- Location and district.
- School type.
- Official email and phone number.
- School description.
- Registration number where applicable.
- School logo.
- Campus cover image.
- Authorized representative details.
- Administrator password.

### Verification flow

```text
Registration submitted
        ↓
Email verification
        ↓
Phone verification
        ↓
School membership verification
        ↓
Administrator approval
        ↓
Account activation
```

---

## Profile Editing Rules

Students and teachers may edit permitted profile information once every six months.

Schools may edit their main profile information once every two years. Emergency changes to official contact information should use a separate verification and approval process.

Users cannot directly change their role, school membership, registration number, staff number, or verification status.

---

## Recommendations

Recommendations use:

- Selected departments.
- Class or Form.
- School.
- Subjects.
- Books opened.
- Resources downloaded.
- Resources liked or saved.
- Search history.
- Questions asked.
- Videos watched.
- Followed schools.
- Recent school uploads.

Recommendations may display explanations such as:

```text
Recommended because you selected Science.
Recommended because you read Biology Form 3 Notes.
New from your school.
Popular among Form 3 Science students.
```

---

## Low-Data and Offline Support

The platform is designed to support users with unreliable or expensive internet access.

Planned capabilities include:

- Downloading approved resources.
- Wi-Fi-only download settings.
- Low-data and standard file quality.
- Resuming interrupted downloads.
- Viewing file size before downloading.
- Downloading subject collections.
- Synchronizing activity after reconnecting.
- Removing downloaded files without removing library records.

---

## Accessibility

The platform should support:

- Adjustable text size.
- High-contrast mode.
- Dark mode.
- Screen-reader-compatible labels.
- Keyboard navigation.
- Alternative text for images.
- Video captions.
- Video transcripts.
- Dyslexia-friendly font options.
- Reduced-motion settings.

---

## Resource Management

Resources should include structured information such as:

- Title.
- Description.
- Author.
- Publisher.
- School.
- Subject.
- Department.
- Class or Form.
- Resource type.
- Language.
- Academic year.
- Edition.
- ISBN where available.
- File information.
- Copyright statement.
- Approval status.

The system should support resource versioning so that corrections and curriculum updates can be recorded without losing the previous version.

---

## Suggested Technology Stack

The technology stack may include:

- React.
- TypeScript.
- Responsive web design.
- Supabase Authentication.
- Supabase PostgreSQL database.
- Supabase Storage.
- Supabase Realtime notifications.
- Capacitor for a future mobile application.

The exact technology stack may be adjusted as development requirements become clearer.

---

## Suggested Project Structure

```text
src/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── types/
├── utils/
└── lib/
```

Suggested feature areas:

```text
Authentication
Profiles
Schools
Memberships
Resources
Books
Past Papers
Library
Discover
Questions
Notifications
Recommendations
Publisher Studio
Administration
```

---

## Development Phases

### Phase 1: Foundation

- Set up the project.
- Implement authentication.
- Create account types.
- Implement email and phone verification.
- Create profiles and school memberships.
- Implement role-based access.

### Phase 2: School profiles

- Create school profiles.
- Add logo and cover image uploads.
- Add school verification.
- Add school following.
- Add school notifications.

### Phase 3: Digital library

- Add resource categories.
- Add books and past papers.
- Add school and teacher publishing.
- Add publishing approval.
- Add search and filters.
- Add resource detail pages.

### Phase 4: Personal library

- Add saved resources.
- Add personal collections.
- Add downloads.
- Add resource history.
- Add saved searches.
- Add version history.

### Phase 5: Discover and questions

- Add Discover tabs.
- Add student questions.
- Add teacher answers.
- Add publisher notifications.
- Add correct-answer marking.
- Add likes and feedback.

### Phase 6: Recommendations and analytics

- Record user activity.
- Add department recommendations.
- Add school recommendations.
- Add activity-based recommendations.
- Add learning analytics.
- Add goals and achievement features.

### Phase 7: Accessibility and offline support

- Add low-data downloads.
- Add accessibility controls.
- Add captions and transcripts.
- Add offline synchronization.
- Test performance on slow connections.

### Phase 8: Testing and deployment

- Test registration and verification.
- Test role permissions.
- Test school data boundaries.
- Test resource publishing.
- Test recommendations.
- Test notifications.
- Test responsive layouts.
- Test accessibility.
- Test backup and recovery.
- Deploy the production version.

---

## Acceptance Criteria

### Registration

- Users can register as students, teachers, or schools.
- Required fields are validated.
- Email and phone verification work.
- Students can select zero or more departments.
- Teachers can select departments and subjects.
- Schools can upload logos and cover images.

### Profiles

- Students and teachers can edit permitted fields according to the six-month rule.
- Schools can edit profile information according to the two-year rule.
- Users cannot edit another user’s profile.
- Roles and school memberships require authorization.

### Publishing

- Schools can publish books and official materials.
- Teachers can publish past papers, notes, and videos.
- Teachers cannot publish books when book publishing is restricted.
- Every resource displays the correct publisher.
- Resource metadata is stored correctly.
- Resource versions can be recorded.

### Digital library

- Users can search by subject, department, class, resource type, school, and year.
- Users can save resources.
- Users can create personal collections.
- Users can download approved resources.
- Low-data options are available.
- Publisher catalogues display published materials.
- Saved searches can generate notifications.

### Discover

- Discover contains All, Books, Papers, Questions, Feed, and Schools.
- Questions and feed are located inside Discover.
- Users can follow school profiles.
- School uploads appear in appropriate feeds and notifications.

### Recommendations

- Department selection affects recommendations.
- Class or Form affects recommendations.
- School uploads are prioritized.
- Reading activity affects recommendations.
- Recommendation reasons are displayed where possible.

### Questions

- Students can ask questions about specific books.
- Book and publisher information is attached automatically.
- Publishers receive relevant notifications.
- Teachers can answer permitted questions.
- Authorized teachers and HODs can mark answers correct.
- Users can like questions and answers.

---

## Contribution Guidelines

Contributions should be focused on improving access to organized educational materials.

Before contributing:

1. Review the project requirements.
2. Keep changes focused on one feature or improvement.
3. Use clear names for components, pages, and services.
4. Test changes on mobile and desktop layouts.
5. Confirm that role permissions are preserved.
6. Check that school and user data remain properly separated.
7. Update the documentation when behavior changes.

Suggested contribution workflow:

```text
Create a feature branch
        ↓
Implement the change
        ↓
Test the change
        ↓
Update documentation
        ↓
Submit a pull request
```

---

## Project Status

The project is currently in the planning and design stage. The requirements, user roles, navigation structure, publishing rules, recommendation logic, and core features are being refined before full implementation begins.

---

## Conclusion

Learn Hub is a digital educational library platform intended to connect secondary school students, teachers, and schools with organized learning materials. The platform will provide a reliable place for discovering books, past papers, notes, pamphlets, revision resources, and videos.

Its main purpose is to make learning resources easier to find and use. School publishing, teacher contributions, personalized recommendations, personal libraries, school updates, offline support, and book-related questions will provide additional support around the main digital library.

The main learning process is:

```text
Find a resource → Save it → Use it → Ask questions → Receive help → Continue learning
```
