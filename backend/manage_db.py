import argparse
from sqlmodel import Session
from main import engine, create_db_and_tables
from db_utils import dump_data, load_data


def main():
    parser = argparse.ArgumentParser(description="Manage database seed data.")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Export command
    export_parser = subparsers.add_parser("export", help="Export database to JSON")
    export_parser.add_argument(
        "--file", default="seed_data.json", help="Output JSON file path"
    )

    # Import command
    import_parser = subparsers.add_parser("import", help="Import database from JSON")
    import_parser.add_argument(
        "--file", default="seed_data.json", help="Input JSON file path"
    )

    args = parser.parse_args()

    if args.command == "export":
        with Session(engine) as session:
            dump_data(session, args.file)
    elif args.command == "import":
        create_db_and_tables()
        with Session(engine) as session:
            load_data(session, args.file)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
