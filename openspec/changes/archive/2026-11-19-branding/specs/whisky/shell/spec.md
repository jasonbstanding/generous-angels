# Spec Delta

## Purpose

App identity layer — the nav brand, page title, favicon, and attribution link that identify the app as Jason B. Drammin'.

## ADDED Requirements

### Requirement: Nav brand
The app navigation SHALL display "Jason B. Drammin'" as the brand name.

#### Scenario: Brand visible in nav
- **WHEN** the user loads any page
- **THEN** the nav shows "Jason B. Drammin'" as the brand text

### Requirement: Page title
The HTML page title SHALL be "Jason B. Drammin'".

#### Scenario: Title shown in browser tab
- **WHEN** the user loads the app
- **THEN** the browser tab displays "Jason B. Drammin'"

### Requirement: Favicon
The app SHALL display the jasonbstanding.com favicon in the browser tab.

#### Scenario: Favicon visible in browser tab
- **WHEN** the user loads the app
- **THEN** the browser tab shows the jasonbstanding.com favicon

### Requirement: Attribution link
The app navigation SHALL include a "Powered by jasonbstanding.com" link that opens jasonbstanding.com in a new tab.

#### Scenario: Attribution link visible
- **WHEN** the user loads any page
- **THEN** the nav shows a "Powered by jasonbstanding.com" link

#### Scenario: Attribution link opens in new tab
- **WHEN** the user clicks the attribution link
- **THEN** jasonbstanding.com opens in a new browser tab
