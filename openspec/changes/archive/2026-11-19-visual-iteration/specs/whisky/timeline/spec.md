# Spec Delta

## ADDED Requirements

### Requirement: Thumbnail image popup
When a user clicks a bottle's thumbnail image, a modal SHALL open displaying the full-size bottle image. The modal SHALL close when the user clicks outside it or presses Escape.

#### Scenario: Thumbnail clicked
- **WHEN** the user clicks a bottle thumbnail image
- **THEN** a modal opens showing the full-size image for that bottle

#### Scenario: Modal dismissed by click-outside
- **WHEN** the modal is open and the user clicks outside the image area
- **THEN** the modal closes

#### Scenario: Modal dismissed by Escape
- **WHEN** the modal is open and the user presses the Escape key
- **THEN** the modal closes
