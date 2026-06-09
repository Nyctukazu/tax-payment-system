drop extension if exists "pg_net";
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    -- other taxpayer fields go here
);

CREATE TABLE feedbacks (
    id BIGSERIAL PRIMARY KEY,
    taxpayer_id BIGINT NOT NULL,
    CONSTRAINT fk_feedback_taxpayer FOREIGN KEY (taxpayer_id) REFERENCES taxpayers(id) ON DELETE CASCADE
);

