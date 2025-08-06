-- migration.sql

-- Создаем таблицу Users для хранения пользователей Telegram
CREATE TABLE IF NOT EXISTS "User" (
	"id" TEXT PRIMARY KEY,           -- Telegram user ID как основной идентификатор
	"name" TEXT NOT NULL,            -- Имя пользователя из Telegram
	"email" TEXT,                    -- Email (может быть NULL, так как Telegram не всегда предоставляет email)
	"image" TEXT,                    -- URL аватара пользователя из Telegram
	"createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу Business с привязкой к User
CREATE TABLE IF NOT EXISTS "Business" (
	"id" TEXT PRIMARY KEY,           -- Уникальный идентификатор бизнеса
	"userId" TEXT NOT NULL,          -- Ссылка на пользователя-владельца
	"businessName" TEXT NOT NULL,    -- Название бизнеса
	"userName" TEXT NOT NULL,        -- Имя владельца
	"email" TEXT,                    -- Контактный email бизнеса
	"createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Создаем таблицу MeetingEvent с привязкой к Business и User
CREATE TABLE IF NOT EXISTS "MeetingEvent" (
	"id" TEXT PRIMARY KEY,             -- Уникальный идентификатор встречи
	"eventName" TEXT NOT NULL,         -- Название встречи
	"duration" INTEGER NOT NULL,       -- Продолжительность в минутах
	"locationType" TEXT NOT NULL,      -- Тип места встречи
	"description" TEXT,                -- Описание встречи
	"themeColor" TEXT NOT NULL,        -- Цвет темы
	"businessId" TEXT NOT NULL,        -- ID бизнеса, к которому относится встреча
	"createdBy" TEXT NOT NULL,         -- ID пользователя, создавшего встречу
	"createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE,
	FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Индексы для ускорения запросов
CREATE INDEX IF NOT EXISTS "idx_business_userId" ON "Business" ("userId");
CREATE INDEX IF NOT EXISTS "idx_meetingevent_businessId" ON "MeetingEvent" ("businessId");
CREATE INDEX IF NOT EXISTS "idx_meetingevent_createdBy" ON "MeetingEvent" ("createdBy");

-- Функция для автоматического обновления updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
	RETURNS TRIGGER AS $$
BEGIN
	NEW."updatedAt" = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updatedAt
CREATE TRIGGER "update_user_updated_at"
	BEFORE UPDATE ON "User"
	FOR EACH ROW
	EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER "update_business_updated_at"
	BEFORE UPDATE ON "Business"
	FOR EACH ROW
	EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER "update_meetingevent_updated_at"
	BEFORE UPDATE ON "MeetingEvent"
	FOR EACH ROW
	EXECUTE PROCEDURE update_updated_at_column();
