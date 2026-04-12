.PHONY: install dev scrape preprocess train evaluate serve test lint clean

install:
	pip install -r requirements.txt

dev:
	pip install -r requirements.txt -r requirements-dev.txt

scrape:
	python scripts/run_scraper.py --app-id com.empatlavang.dana --count 10000

preprocess:
	python -m pipeline.preprocessing.cleaner

train:
	python -m pipeline.training.trainer --mode experiment

train-prod:
	python -m pipeline.training.trainer --mode production --epochs 10

embed:
	python -m pipeline.embedding.generator

evaluate:
	python -m pipeline.evaluation.metrics

validate:
	python -m pipeline.validation.model_validator --min-accuracy 0.85

serve:
	uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

pipeline:
	python scripts/run_pipeline.py

test:
	python -m pytest tests/ -v --tb=short

lint:
	python -m ruff check pipeline/ api/ --line-length=120

clean:
	rm -rf models/*.pt models/*.bin reports/*.json __pycache__ .pytest_cache